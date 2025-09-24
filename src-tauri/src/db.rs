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

#[derive(Debug, Deserialize)]
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
    #[allow(non_snake_case)]
    pub jastId: Option<String>,
}

#[tauri::command]
pub async fn is_game_synced(app_handle: AppHandle, payload: String) -> Result<bool, String> {
    let payload: IdPayload = serde_json::from_str(&payload).map_err(|e| e.to_string())?;
    let key = payload
        .jast_id
        .or(payload.jastId)
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
    #[allow(non_snake_case)]
    pub jastIds: Option<Vec<String>>,
}

#[derive(Debug, Serialize)]
pub struct SyncStatus {
    pub jast_id: String,
    pub synced: bool,
}

#[tauri::command]
pub async fn bulk_is_game_synced(app_handle: AppHandle, payload: String) -> Result<Vec<SyncStatus>, String> {
    let payload: BulkIdsPayload = serde_json::from_str(&payload).map_err(|e| e.to_string())?;
    let ids = payload
        .jast_ids
        .or(payload.jastIds)
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
