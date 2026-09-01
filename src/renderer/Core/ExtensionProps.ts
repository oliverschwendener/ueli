import type { ContextBridge } from "@shared/Core";

export type ExtensionProps = {
    contextBridge: ContextBridge;
    goBack: () => void;
};
