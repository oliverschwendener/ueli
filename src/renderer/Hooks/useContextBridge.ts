import type { ContextBridge } from "@common/Core";

export const useContextBridge = (): { contextBridge: ContextBridge } => ({ contextBridge: window.ContextBridge });
