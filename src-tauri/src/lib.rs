use tauri::Manager;

mod db;

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
    let migrations = crate::db::migrations();

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:gallery.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![greet, password_check, crate::db::save_game_if_missing, crate::db::is_game_synced, crate::db::bulk_is_game_synced, crate::db::search_games_by_tags, crate::db::list_db_tags, crate::db::search_db_games, crate::db::search_db_games_paged, crate::db::get_game_vndb_id, crate::db::set_game_vndb_id, crate::db::get_game_db])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
