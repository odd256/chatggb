import { invoke } from "@tauri-apps/api/core";

export interface ConversationMeta {
  id: string;
  title: string;
  mode: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation extends ConversationMeta {
  messages: any[];
  snapshot: string | null;
}

export async function listConversations(): Promise<ConversationMeta[]> {
  return invoke<ConversationMeta[]>("list_conversations");
}

export async function getConversation(id: string): Promise<Conversation> {
  return invoke<Conversation>("get_conversation", { id });
}

export async function saveConversation(conversation: Conversation): Promise<void> {
  await invoke("save_conversation", { conversation });
}

export async function deleteConversation(id: string): Promise<void> {
  await invoke("delete_conversation", { id });
}

export async function renameConversation(id: string, title: string): Promise<void> {
  await invoke("rename_conversation", { id, title });
}

export async function setActiveConversation(id: string | null): Promise<void> {
  await invoke("set_active_conversation", { id });
}
