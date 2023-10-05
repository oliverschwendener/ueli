import type { ContextBridge } from "@common/ContextBridge";

export const useContextBridge = (): { contextBridge: ContextBridge } => ({ contextBridge: window.ContextBridge });
