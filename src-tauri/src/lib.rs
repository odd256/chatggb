use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use serde::{Deserialize, Serialize};
use tauri::Manager;

#[derive(Serialize, Deserialize, Default)]
struct Config {
    provider: Option<String>,
    api_keys: HashMap<String, String>,
    base_urls: HashMap<String, String>,
}

#[derive(Serialize)]
struct ConfigResponse {
    provider: String,
    api_key: String,
    base_url: String,
}

fn config_path(app: &tauri::AppHandle) -> PathBuf {
    app.path()
        .app_data_dir()
        .expect("failed to resolve app data dir")
        .join("config.json")
}

fn load_config(app: &tauri::AppHandle) -> Config {
    let path = config_path(app);
    if path.exists() {
        let raw = fs::read_to_string(&path).unwrap_or_default();
        serde_json::from_str(&raw).unwrap_or_default()
    } else {
        Config::default()
    }
}

fn save_config(app: &tauri::AppHandle, config: &Config) -> Result<(), String> {
    let path = config_path(app);
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    let raw = serde_json::to_string_pretty(config).map_err(|e| e.to_string())?;
    fs::write(&path, raw).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_config(app: tauri::AppHandle) -> Result<ConfigResponse, String> {
    let config = load_config(&app);
    let provider = config.provider.unwrap_or_else(|| "kimi".to_string());
    let api_key = config
        .api_keys
        .get(&provider)
        .cloned()
        .unwrap_or_default();
    let base_url = config
        .base_urls
        .get(&provider)
        .cloned()
        .unwrap_or_default();
    Ok(ConfigResponse {
        provider,
        api_key,
        base_url,
    })
}

#[tauri::command]
fn set_config(
    app: tauri::AppHandle,
    provider: String,
    api_key: String,
    base_url: String,
) -> Result<(), String> {
    let mut config = load_config(&app);
    config.provider = Some(provider.clone());
    config.api_keys.insert(provider.clone(), api_key);
    if base_url.is_empty() {
        config.base_urls.remove(&provider);
    } else {
        config.base_urls.insert(provider, base_url);
    }
    save_config(&app, &config)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_config, set_config])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
