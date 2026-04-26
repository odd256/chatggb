import { createContext, useContext } from "react";

export interface ApiConfig {
  provider: string;
  apiKey: string;
  baseUrl: string;
  loaded: boolean;
  saveConfig: (provider: string, key: string, baseUrl: string) => Promise<void>;
}

export const ApiConfigContext = createContext<ApiConfig>({
  provider: "kimi",
  apiKey: "",
  baseUrl: "",
  loaded: false,
  saveConfig: async () => {},
});

export function useApiConfig() {
  return useContext(ApiConfigContext);
}
