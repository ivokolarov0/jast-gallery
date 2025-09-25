use tauri_plugin_sql::{Migration, MigrationKind};
use serde::{Deserialize, Serialize};
use rusqlite::{params, Connection, OptionalExtension};
use tauri::AppHandle;
use tauri::Manager;
use std::collections::HashSet;

const SCHEMA_SQL: &str = r#"
        CREATE TABLE IF NOT EXISTS games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            jast_id TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            description TEXT,
            release_date TEXT,
            cover_image TEXT,
            gallery_json TEXT,
            product_code TEXT,
            vndb_id TEXT,
            features_json TEXT,
            created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
            updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
        );

        CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tag_key TEXT NOT NULL UNIQUE,
            title TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS game_tags (
            game_id INTEGER NOT NULL,
            tag_id INTEGER NOT NULL,
            PRIMARY KEY (game_id, tag_id),
            FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
            FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_games_jast_id ON games(jast_id);
        CREATE INDEX IF NOT EXISTS idx_tags_tag_key ON tags(tag_key);
        CREATE INDEX IF NOT EXISTS idx_game_tags_game ON game_tags(game_id);
        CREATE INDEX IF NOT EXISTS idx_game_tags_tag ON game_tags(tag_id);
"#;

pub fn migrations() -> Vec<Migration> {
    vec![Migration {
        version: 1,
        description: "create core tables",
        sql: SCHEMA_SQL,
        kind: MigrationKind::Up,
    }]
}

fn ensure_dir_and_path(app_handle: &AppHandle) -> Result<std::path::PathBuf, String> {
    let dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir.join("gallery.db"))
}

fn open_conn(app_handle: &AppHandle) -> Result<Connection, String> {
    let db_path = ensure_dir_and_path(app_handle)?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute_batch("PRAGMA foreign_keys=ON;").map_err(|e| e.to_string())?;
    conn.execute_batch(SCHEMA_SQL).map_err(|e| e.to_string())?;
    Ok(conn)
}

#[derive(Debug, Deserialize, Serialize)]
pub struct TagPayload {
    pub key: String,
    pub title: String,
}

#[derive(Debug, Deserialize)]
pub struct GamePayload {
    pub jast_id: String,
    pub name: String,
    pub description: Option<String>,
    pub release_date: Option<String>,
    pub cover_image: Option<String>,
    pub gallery_images: Option<Vec<String>>,
    pub product_code: Option<String>,
    pub vndb_id: Option<String>,
    pub features: Option<serde_json::Value>,
    pub tags: Vec<TagPayload>,
}

#[derive(Debug, Serialize)]
pub struct GameListItem {
    pub jast_id: String,
    pub name: String,
    pub cover_image: Option<String>,
}

#[tauri::command]
pub async fn save_game_if_missing(app_handle: AppHandle, payload: String) -> Result<bool, String> {
    let payload: GamePayload = serde_json::from_str(&payload).map_err(|e| e.to_string())?;
    let mut conn = open_conn(&app_handle)?;
    let tx = conn.transaction().map_err(|e| e.to_string())?;

    let existing: Option<i64> = tx
        .query_row(
            "SELECT id FROM games WHERE jast_id = ?1",
            params![payload.jast_id],
            |row| row.get(0),
        )
        .optional()
        .map_err(|e| e.to_string())?;

    if existing.is_some() {
        // Already present
        return Ok(false);
    }

    let gallery_json = payload
        .gallery_images
        .as_ref()
        .map(|v| serde_json::to_string(v).unwrap_or_default());
    let features_json = payload
        .features
        .as_ref()
        .map(|v| serde_json::to_string(v).unwrap_or_default());

    tx.execute(
        "INSERT INTO games (jast_id, name, description, release_date, cover_image, gallery_json, product_code, vndb_id, features_json) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
        params![
            payload.jast_id,
            payload.name,
            payload.description,
            payload.release_date,
            payload.cover_image,
            gallery_json,
            payload.product_code,
            payload.vndb_id,
            features_json
        ],
    )
    .map_err(|e| e.to_string())?;

    let game_id: i64 = tx
        .query_row("SELECT id FROM games WHERE jast_id = ?1", params![payload.jast_id], |row| row.get(0))
        .map_err(|e| e.to_string())?;

    for t in payload.tags.iter() {
        tx.execute(
            "INSERT INTO tags (tag_key, title) VALUES (?1, ?2)
             ON CONFLICT(tag_key) DO UPDATE SET title = excluded.title",
            params![t.key, t.title],
        )
        .map_err(|e| e.to_string())?;
        let tag_id: i64 = tx
            .query_row(
                "SELECT id FROM tags WHERE tag_key = ?1",
                params![t.key],
                |row| row.get(0),
            )
            .map_err(|e| e.to_string())?;
        tx.execute(
            "INSERT OR IGNORE INTO game_tags (game_id, tag_id) VALUES (?1, ?2)",
            params![game_id, tag_id],
        )
        .map_err(|e| e.to_string())?;
    }

    tx.commit().map_err(|e| e.to_string())?;
    Ok(true)
}

#[derive(Debug, Deserialize)]
struct IdPayload {
    pub jast_id: Option<String>,
}

#[tauri::command]
pub async fn is_game_synced(app_handle: AppHandle, payload: String) -> Result<bool, String> {
    let payload: IdPayload = serde_json::from_str(&payload).map_err(|e| e.to_string())?;
    let key = payload
        .jast_id
        .ok_or_else(|| "missing required parameter: jast_id".to_string())?;

    let conn = open_conn(&app_handle)?;
    let exists: Option<i64> = conn
        .query_row(
            "SELECT id FROM games WHERE jast_id = ?1",
            params![key],
            |row| row.get(0),
        )
        .optional()
        .map_err(|e| e.to_string())?;
    Ok(exists.is_some())
}

#[derive(Debug, Deserialize)]
struct BulkIdsPayload {
    pub jast_ids: Option<Vec<String>>,
}

#[derive(Debug, Serialize)]
pub struct SyncStatus {
    pub jast_id: String,
    pub synced: bool,
}

#[tauri::command]
pub async fn bulk_is_game_synced(app_handle: AppHandle, payload: String) -> Result<Vec<SyncStatus>, String> {
    let payload: BulkIdsPayload = serde_json::from_str(&payload).map_err(|e| e.to_string())?;
    let ids = payload.jast_ids
        .unwrap_or_default();

    if ids.is_empty() {
        return Ok(Vec::new());
    }

    let conn = open_conn(&app_handle)?;
    let placeholders = std::iter::repeat("?").take(ids.len()).collect::<Vec<_>>().join(",");
    let sql = format!("SELECT jast_id FROM games WHERE jast_id IN ({})", placeholders);

    let mut params_dyn: Vec<&dyn rusqlite::ToSql> = ids.iter().map(|s| s as &dyn rusqlite::ToSql).collect();

    let mut present = HashSet::new();
    let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map(rusqlite::params_from_iter(params_dyn.drain(..)), |row| row.get::<_, String>(0))
        .map_err(|e| e.to_string())?;
    for r in rows {
        let v = r.map_err(|e| e.to_string())?;
        present.insert(v);
    }

    let out = ids
        .into_iter()
        .map(|id| SyncStatus { jast_id: id.clone(), synced: present.contains(&id) })
        .collect();

    Ok(out)
}

#[tauri::command]
pub async fn search_games_by_tags(app_handle: AppHandle, tag_keys: Vec<String>) -> Result<Vec<GameListItem>, String> {
    let conn = open_conn(&app_handle)?;
    if tag_keys.is_empty() {
        let mut stmt = conn
            .prepare("SELECT jast_id, name, cover_image FROM games ORDER BY name COLLATE NOCASE")
            .map_err(|e| e.to_string())?;
        let rows = stmt
            .query_map([], |row| {
                Ok(GameListItem {
                    jast_id: row.get(0)?,
                    name: row.get(1)?,
                    cover_image: row.get(2).ok(),
                })
            })
            .map_err(|e| e.to_string())?;
        let mut out = Vec::new();
        for r in rows { out.push(r.map_err(|e| e.to_string())?); }
        return Ok(out);
    }

    // Build dynamic placeholders for IN clause
    let placeholders = std::iter::repeat("?").take(tag_keys.len()).collect::<Vec<_>>().join(",");
    let sql = format!(
        "SELECT g.jast_id, g.name, g.cover_image
         FROM games g
         JOIN game_tags gt ON gt.game_id = g.id
         JOIN tags t ON t.id = gt.tag_id
         WHERE t.tag_key IN ({})
         GROUP BY g.id
         HAVING COUNT(DISTINCT t.tag_key) = ?
         ORDER BY g.name COLLATE NOCASE",
        placeholders
    );

    let mut params_dyn: Vec<&dyn rusqlite::ToSql> = tag_keys.iter().map(|s| s as &dyn rusqlite::ToSql).collect();
    let count_param: i64 = tag_keys.len() as i64;
    params_dyn.push(&count_param);

    let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map(rusqlite::params_from_iter(params_dyn), |row| {
            Ok(GameListItem {
                jast_id: row.get(0)?,
                name: row.get(1)?,
                cover_image: row.get(2).ok(),
            })
        })
        .map_err(|e| e.to_string())?;

    let mut out = Vec::new();
    for r in rows { out.push(r.map_err(|e| e.to_string())?); }
    Ok(out)
}

#[tauri::command]
pub async fn list_db_tags(app_handle: AppHandle) -> Result<Vec<TagPayload>, String> {
    let conn = open_conn(&app_handle)?;
    let mut stmt = conn
        .prepare("SELECT tag_key, title FROM tags ORDER BY title COLLATE NOCASE")
        .map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map([], |row| {
            Ok(TagPayload { key: row.get(0)?, title: row.get(1)? })
        })
        .map_err(|e| e.to_string())?;
    let mut out = Vec::new();
    for r in rows { out.push(r.map_err(|e| e.to_string())?); }
    Ok(out)
}

#[derive(Debug, Deserialize)]
struct SearchPayload {
    pub query: Option<String>,
    pub tag_keys: Option<Vec<String>>,
}

#[tauri::command]
pub async fn search_db_games(app_handle: AppHandle, payload: String) -> Result<Vec<GameListItem>, String> {
    let payload: SearchPayload = serde_json::from_str(&payload).map_err(|e| e.to_string())?;
    let conn = open_conn(&app_handle)?;

    let mut where_clauses: Vec<String> = Vec::new();
    let mut dyn_params: Vec<Box<dyn rusqlite::ToSql>> = Vec::new();

    if let Some(q) = payload.query.as_ref().and_then(|s| {
        let t = s.trim();
        if t.is_empty() { None } else { Some(t.to_string()) }
    }) {
        where_clauses.push("LOWER(g.name) LIKE LOWER(?)".to_string());
        dyn_params.push(Box::new(format!("%{}%", q)));
    }

    let mut sql = String::from("SELECT g.jast_id, g.name, COALESCE(g.cover_image, json_extract(g.gallery_json,'$[0]')) AS cover_image FROM games g");

    let tag_keys = payload.tag_keys.unwrap_or_default();
    if !tag_keys.is_empty() {
        sql.push_str(" JOIN game_tags gt ON gt.game_id = g.id JOIN tags t ON t.id = gt.tag_id");
    }

    if !where_clauses.is_empty() {
        sql.push_str(" WHERE ");
        sql.push_str(&where_clauses.join(" AND "));
    }

    if !tag_keys.is_empty() {
        sql.push_str(" GROUP BY g.id HAVING COUNT(DISTINCT t.tag_key) = ?");
    }

    sql.push_str(" ORDER BY g.name COLLATE NOCASE");

    let mut param_refs: Vec<&dyn rusqlite::ToSql> = dyn_params.iter().map(|b| &**b as &dyn rusqlite::ToSql).collect();
    let count_param: i64 = tag_keys.len() as i64;

    let final_rows = if tag_keys.is_empty() {
        let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;
        let rows = stmt
            .query_map(rusqlite::params_from_iter(param_refs), |row| {
                Ok(GameListItem { jast_id: row.get(0)?, name: row.get(1)?, cover_image: row.get(2).ok() })
            })
            .map_err(|e| e.to_string())?;
        let mut out = Vec::new();
        for r in rows { out.push(r.map_err(|e| e.to_string())?); }
        out
    } else {
        let placeholders = std::iter::repeat("?").take(tag_keys.len()).collect::<Vec<_>>().join(",");
        let sql2 = sql.replace("GROUP BY g.id HAVING", &format!("AND t.tag_key IN ({}) GROUP BY g.id HAVING", placeholders));

        let mut params_all: Vec<&dyn rusqlite::ToSql> = Vec::new();
        params_all.extend(param_refs.drain(..));
        let tag_params: Vec<&dyn rusqlite::ToSql> = tag_keys.iter().map(|s| s as &dyn rusqlite::ToSql).collect();
        params_all.extend(tag_params);
        params_all.push(&count_param);

        let mut stmt = conn.prepare(&sql2).map_err(|e| e.to_string())?;
        let rows = stmt
            .query_map(rusqlite::params_from_iter(params_all), |row| {
                Ok(GameListItem { jast_id: row.get(0)?, name: row.get(1)?, cover_image: row.get(2).ok() })
            })
            .map_err(|e| e.to_string())?;
        let mut out = Vec::new();
        for r in rows { out.push(r.map_err(|e| e.to_string())?); }
        out
    };

    Ok(final_rows)
}

#[derive(Debug, Deserialize)]
struct PagedSearchPayload {
    pub query: Option<String>,
    pub tag_keys: Option<Vec<String>>,
    pub page: Option<i64>,
    pub page_size: Option<i64>,
}

#[derive(Debug, Serialize)]
pub struct PagedResult {
    pub items: Vec<GameListItem>,
    pub total: i64,
    pub pages: i64,
}

#[tauri::command]
pub async fn search_db_games_paged(app_handle: AppHandle, payload: String) -> Result<PagedResult, String> {
    let payload: PagedSearchPayload = serde_json::from_str(&payload).map_err(|e| e.to_string())?;
    let conn = open_conn(&app_handle)?;

    // Build WHERE
    let mut where_parts: Vec<String> = Vec::new();
    let mut where_params: Vec<String> = Vec::new();
    if let Some(q) = payload.query.as_ref().map(|s| s.trim().to_string()).filter(|s| !s.is_empty()) {
        where_parts.push("LOWER(g.name) LIKE LOWER(?)".to_string());
        where_params.push(format!("%{}%", q));
    }

    let tag_keys = payload.tag_keys.clone().unwrap_or_default();

    // Count query
    let total: i64 = if tag_keys.is_empty() {
        let mut sql = String::from("SELECT COUNT(*) FROM games g");
        if !where_parts.is_empty() {
            sql.push_str(" WHERE ");
            sql.push_str(&where_parts.join(" AND "));
        }
        let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;
        let refs: Vec<&dyn rusqlite::ToSql> = where_params.iter().map(|s| s as &dyn rusqlite::ToSql).collect();
        stmt.query_row(rusqlite::params_from_iter(refs), |row| row.get(0)).map_err(|e| e.to_string())?
    } else {
        let placeholders = std::iter::repeat("?").take(tag_keys.len()).collect::<Vec<_>>().join(",");
        let mut sql = String::from("SELECT COUNT(*) FROM (SELECT g.id FROM games g JOIN game_tags gt ON gt.game_id = g.id JOIN tags t ON t.id = gt.tag_id");
        if !where_parts.is_empty() {
            sql.push_str(" WHERE ");
            sql.push_str(&where_parts.join(" AND "));
            sql.push_str(" AND t.tag_key IN (");
        } else {
            sql.push_str(" WHERE t.tag_key IN (");
        }
        sql.push_str(&placeholders);
        sql.push_str(") GROUP BY g.id HAVING COUNT(DISTINCT t.tag_key) = ?) sub");

        let mut params_any: Vec<Box<dyn rusqlite::ToSql>> = Vec::new();
        for s in where_params.iter() { params_any.push(Box::new(s.clone())); }
        for k in tag_keys.iter() { params_any.push(Box::new(k.clone())); }
        let count_param: i64 = tag_keys.len() as i64;
        params_any.push(Box::new(count_param));
        let refs: Vec<&dyn rusqlite::ToSql> = params_any.iter().map(|b| &**b as &dyn rusqlite::ToSql).collect();

        let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;
        stmt.query_row(rusqlite::params_from_iter(refs), |row| row.get(0)).map_err(|e| e.to_string())?
    };

    // Paging
    let page_size = payload.page_size.unwrap_or(20).clamp(1, 100);
    let page = payload.page.unwrap_or(1).max(1);
    let pages = ((total + page_size - 1) / page_size).max(1);
    let offset = (page - 1) * page_size;

    // Items query
    let mut sql = String::from("SELECT g.jast_id, g.name, COALESCE(g.cover_image, json_extract(g.gallery_json,'$[0]')) AS cover_image FROM games g");
    if !tag_keys.is_empty() {
        sql.push_str(" JOIN game_tags gt ON gt.game_id = g.id JOIN tags t ON t.id = gt.tag_id");
    }
    if !where_parts.is_empty() {
        sql.push_str(" WHERE ");
        sql.push_str(&where_parts.join(" AND "));
    }
    let mut params_any: Vec<Box<dyn rusqlite::ToSql>> = Vec::new();
    for s in where_params.iter() { params_any.push(Box::new(s.clone())); }

    if !tag_keys.is_empty() {
        let placeholders = std::iter::repeat("?").take(tag_keys.len()).collect::<Vec<_>>().join(",");
        if where_parts.is_empty() { sql.push_str(" WHERE "); } else { sql.push_str(" AND "); }
        sql.push_str(&format!("t.tag_key IN ({})", placeholders));
        for k in tag_keys.iter() { params_any.push(Box::new(k.clone())); }
        let count_param: i64 = tag_keys.len() as i64;
        sql.push_str(" GROUP BY g.id HAVING COUNT(DISTINCT t.tag_key) = ?");
        params_any.push(Box::new(count_param));
    }

    sql.push_str(" ORDER BY g.name COLLATE NOCASE LIMIT ? OFFSET ?");
    params_any.push(Box::new(page_size));
    params_any.push(Box::new(offset));

    let refs: Vec<&dyn rusqlite::ToSql> = params_any.iter().map(|b| &**b as &dyn rusqlite::ToSql).collect();
    let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map(rusqlite::params_from_iter(refs), |row| {
            Ok(GameListItem { jast_id: row.get(0)?, name: row.get(1)?, cover_image: row.get(2).ok() })
        })
        .map_err(|e| e.to_string())?;

    let mut items = Vec::new();
    for r in rows { items.push(r.map_err(|e| e.to_string())?); }

    Ok(PagedResult { items, total, pages })
}

#[derive(Debug, Deserialize)]
struct SetVndbPayload {
    pub jast_id: String,
    pub vndb_id: Option<String>,
}

#[tauri::command]
pub async fn get_game_vndb_id(app_handle: AppHandle, payload: String) -> Result<Option<String>, String> {
    let payload: IdPayload = serde_json::from_str(&payload).map_err(|e| e.to_string())?;
    let key = payload
        .jast_id
        .ok_or_else(|| "missing required parameter: jast_id".to_string())?;
    let conn = open_conn(&app_handle)?;
    let v: Option<String> = conn
        .query_row(
            "SELECT vndb_id FROM games WHERE jast_id = ?1",
            params![key],
            |row| row.get(0),
        )
        .optional()
        .map_err(|e| e.to_string())?;
    Ok(v)
}

#[tauri::command]
pub async fn set_game_vndb_id(app_handle: AppHandle, payload: String) -> Result<bool, String> {
    let payload: SetVndbPayload = serde_json::from_str(&payload).map_err(|e| e.to_string())?;
    let mut conn = open_conn(&app_handle)?;
    let affected = conn
        .execute(
            "UPDATE games SET vndb_id = ?2, updated_at = strftime('%s','now') WHERE jast_id = ?1",
            params![payload.jast_id, payload.vndb_id],
        )
        .map_err(|e| e.to_string())?;
    Ok(affected > 0)
}
