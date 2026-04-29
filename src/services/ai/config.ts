export interface ProviderConfig {
  id: string;
  name: string;
  api: string;
  model: string;
  getKeyUrl: string;
}

export const PROVIDERS: ProviderConfig[] = [
  {
    id: "kimi",
    name: "Kimi (月之暗面)",
    api: "https://api.moonshot.cn/v1",
    model: "moonshot-v1-8k",
    getKeyUrl: "https://platform.moonshot.cn/console/api-keys",
  },
  {
    id: "glm",
    name: "智谱 GLM",
    api: "https://open.bigmodel.cn/api/paas/v4",
    model: "glm-4-flash",
    getKeyUrl: "https://open.bigmodel.cn/usercenter/apikeys",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    api: "https://api.deepseek.com/v1",
    model: "deepseek-chat",
    getKeyUrl: "https://platform.deepseek.com/api_keys",
  },
  {
    id: "openai",
    name: "OpenAI",
    api: "https://api.openai.com/v1",
    model: "gpt-4o",
    getKeyUrl: "https://platform.openai.com/api-keys",
  },
];

export function getProvider(id: string): ProviderConfig | undefined {
  return PROVIDERS.find((p) => p.id === id);
}
