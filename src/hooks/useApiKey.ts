import { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";

interface Config {
  provider: string;
  api_key: string;
  base_url: string;
}

export function useApiKey() {
  const [provider, setProvider] = useState("kimi");
  const [apiKey, setApiKeyState] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    invoke<Config>("get_config")
      .then((config) => {
        setProvider(config.provider || "kimi");
        setApiKeyState(config.api_key || "");
        setBaseUrl(config.base_url || "");
      })
      .catch(() => {
        setProvider("kimi");
        setApiKeyState("");
        setBaseUrl("");
      })
      .finally(() => setLoaded(true));
  }, []);

  const saveConfig = useCallback(
    async (newProvider: string, key: string, url: string) => {
      await invoke("set_config", {
        provider: newProvider,
        apiKey: key,
        baseUrl: url,
      });
      setProvider(newProvider);
      setApiKeyState(key);
      setBaseUrl(url);
    },
    [],
  );

  return { provider, apiKey, baseUrl, loaded, saveConfig };
}
