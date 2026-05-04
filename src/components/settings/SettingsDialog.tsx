import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PROVIDERS, getProvider } from "@/agent";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: string;
  apiKey: string;
  baseUrl: string;
  onSave: (provider: string, key: string, baseUrl: string) => Promise<void>;
}

export function SettingsDialog({
  open,
  onOpenChange,
  provider: savedProvider,
  apiKey: savedKey,
  baseUrl: savedBaseUrl,
  onSave,
}: SettingsDialogProps) {
  const [provider, setProvider] = useState(savedProvider);
  const [key, setKey] = useState(savedKey);
  const [baseUrl, setBaseUrl] = useState(savedBaseUrl);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setProvider(savedProvider);
    setKey(savedKey);
    setBaseUrl(savedBaseUrl);
  }, [savedProvider, savedKey, savedBaseUrl, open]);

  const handleProviderChange = (newProvider: string) => {
    setProvider(newProvider);
    const p = getProvider(newProvider);
    if (p && !baseUrl) {
      setBaseUrl(p.api);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(provider, key.trim(), baseUrl.trim());
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const currentProvider = getProvider(provider);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API 设置</DialogTitle>
          <DialogDescription>
            选择大模型服务商并配置 API Key。Key 仅存储在本地。
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="provider">模型服务商</Label>
            <select
              id="provider"
              value={provider}
              onChange={(e) => handleProviderChange(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="base-url">Base URL</Label>
            <Input
              id="base-url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder={currentProvider?.api || ""}
            />
            <p className="text-xs text-muted-foreground">
              默认使用官方地址，可替换为代理或兼容 API 地址
            </p>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="请输入 API Key..."
            />
            {currentProvider && (
              <p className="text-xs text-muted-foreground">
                从{" "}
                <a
                  href={currentProvider.getKeyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-foreground"
                >
                  {currentProvider.name}
                </a>{" "}
                获取 API Key
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={saving || !key.trim()}>
            {saving ? "保存中..." : "保存"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
