use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use serde::{Deserialize, Serialize};
use serde_json::Value;
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

// ── Conversation persistence ──────────────────────────────────────────

#[derive(Serialize, Deserialize, Clone)]
struct ConversationMeta {
    id: String,
    title: String,
    mode: String,
    #[serde(rename = "createdAt")]
    created_at: String,
    #[serde(rename = "updatedAt")]
    updated_at: String,
}

#[derive(Serialize, Deserialize, Clone)]
struct Conversation {
    id: String,
    title: String,
    mode: String,
    #[serde(rename = "createdAt")]
    created_at: String,
    #[serde(rename = "updatedAt")]
    updated_at: String,
    messages: Vec<Value>,
    snapshot: Option<String>,
}

fn conversations_dir(app: &tauri::AppHandle) -> PathBuf {
    app.path()
        .app_data_dir()
        .expect("failed to resolve app data dir")
        .join("conversations")
}

fn conv_path(app: &tauri::AppHandle, id: &str) -> PathBuf {
    conversations_dir(app).join(format!("{id}.json"))
}

#[tauri::command]
fn list_conversations(app: tauri::AppHandle) -> Result<Vec<ConversationMeta>, String> {
    let dir = conversations_dir(&app);
    if !dir.exists() {
        return Ok(vec![]);
    }
    let mut metas: Vec<ConversationMeta> = Vec::new();
    let entries = fs::read_dir(&dir).map_err(|e| e.to_string())?;
    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        if path.extension().and_then(|e| e.to_str()) == Some("json") {
            if let Ok(raw) = fs::read_to_string(&path) {
                if let Ok(conv) = serde_json::from_str::<Conversation>(&raw) {
                    metas.push(ConversationMeta {
                        id: conv.id,
                        title: conv.title,
                        mode: conv.mode,
                        created_at: conv.created_at,
                        updated_at: conv.updated_at,
                    });
                }
            }
        }
    }
    metas.sort_by(|a, b| b.updated_at.cmp(&a.updated_at));
    Ok(metas)
}

#[tauri::command]
fn get_conversation(app: tauri::AppHandle, id: String) -> Result<Conversation, String> {
    let path = conv_path(&app, &id);
    let raw = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    serde_json::from_str(&raw).map_err(|e| e.to_string())
}

#[tauri::command]
fn save_conversation(app: tauri::AppHandle, conversation: Conversation) -> Result<(), String> {
    let dir = conversations_dir(&app);
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let path = dir.join(format!("{}.json", conversation.id));
    let raw = serde_json::to_string_pretty(&conversation).map_err(|e| e.to_string())?;
    fs::write(&path, raw).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_conversation(app: tauri::AppHandle, id: String) -> Result<(), String> {
    let path = conv_path(&app, &id);
    if path.exists() {
        fs::remove_file(&path).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
fn rename_conversation(app: tauri::AppHandle, id: String, title: String) -> Result<(), String> {
    let path = conv_path(&app, &id);
    let raw = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    let mut conv: Conversation = serde_json::from_str(&raw).map_err(|e| e.to_string())?;
    conv.title = title;
    let out = serde_json::to_string_pretty(&conv).map_err(|e| e.to_string())?;
    fs::write(&path, out).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_active_conversation(app: tauri::AppHandle) -> Result<Option<String>, String> {
    let path = app
        .path()
        .app_data_dir()
        .expect("failed to resolve app data dir")
        .join("active_conversation.json");
    if !path.exists() {
        return Ok(None);
    }
    let raw = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    let data: Value = serde_json::from_str(&raw).map_err(|e| e.to_string())?;
    Ok(data.get("id").and_then(|v| v.as_str().map(String::from)))
}

#[tauri::command]
fn set_active_conversation(app: tauri::AppHandle, id: Option<String>) -> Result<(), String> {
    let path = app
        .path()
        .app_data_dir()
        .expect("failed to resolve app data dir")
        .join("active_conversation.json");
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    let data = serde_json::json!({ "id": id });
    fs::write(&path, data.to_string()).map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_config,
            set_config,
            list_conversations,
            get_conversation,
            save_conversation,
            delete_conversation,
            rename_conversation,
            set_active_conversation,
            get_active_conversation
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
