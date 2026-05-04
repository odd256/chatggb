import { useState, useRef, useEffect } from "react";
import { SettingsDialog } from "@/components/settings/SettingsDialog";
import { useApiKey } from "@/hooks/useApiKey";
import { ApiConfigContext } from "@/contexts/ApiConfigContext";
import { SessionProvider } from "@/contexts/SessionContext";
import { ChatPage } from "@/pages/ChatPage";
import "./App.css";

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { provider, apiKey, baseUrl, loaded, saveConfig } = useApiKey();
  const hasPromptedSettings = useRef(false);

  useEffect(() => {
    if (!hasPromptedSettings.current && loaded && !apiKey) {
      setSettingsOpen(true);
      hasPromptedSettings.current = true;
    }
  }, [loaded, apiKey]);

  return (
    <ApiConfigContext.Provider
      value={{ provider, apiKey, baseUrl, loaded, saveConfig }}
    >
      <SessionProvider>
        <ChatPage onOpenSettings={() => setSettingsOpen(true)} />
        <SettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          provider={provider}
          apiKey={apiKey}
          baseUrl={baseUrl}
          onSave={saveConfig}
        />
      </SessionProvider>
    </ApiConfigContext.Provider>
  );
}

export default App;
