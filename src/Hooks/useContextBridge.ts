import type { ContextBridge } from "@common/ContextBridge";

export const useContextBridge = (): ContextBridge => window.ContextBridge;
