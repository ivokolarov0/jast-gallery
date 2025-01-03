use tauri_plugin_sql::{Migration, MigrationKind};
use tauri::Manager;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn password_check(app_handle: tauri::AppHandle, password: String) -> Result<bool, String> {
    let app_dir = app_handle.path().app_config_dir()
        .map_err(|e| {
            e.to_string()
        })?;
    
    let mut store = tauri_plugin_store::StoreBuilder::new(app_dir.join("store.bin"))
        .build(app_handle.clone());
    
    store.load().map_err(|e| {
        e.to_string()
    })?;
    
    let stored_password = store.get("app_pass")
        .ok_or_else(|| {
            "Password not found in store".to_string()
        })?
        .as_str()
        .ok_or_else(|| "Invalid password format".to_string())?;
    
    Ok(stored_password == password)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "CREATE TABLE games (
                id INTEGER PRIMARY KEY, 
                product_name VARCHAR(255), 
                product_image VARCHAR(255), 
                product_code VARCHAR(255), 
                game_id INT, 
                tags TEXT[], 
                vndb_id TEXT,
                vndb_tags TEXT[],
                game_translation_id INT
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_tags_tables",
            sql: "
            CREATE TABLE tags (
                id INTEGER PRIMARY KEY, 
                title TEXT
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "create_game_tags ",
            sql: "CREATE TABLE game_tags (
                game_id INTEGER, 
                tag_id INTEGER,
                PRIMARY KEY (game_id, tag_id),
                FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
                FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
            );",
            kind: MigrationKind::Up,
        },

    ];

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:games.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![greet, password_check])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
