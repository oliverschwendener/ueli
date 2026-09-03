import type { ContextBridge } from "@Shared/Core";

export type ExtensionProps = {
    contextBridge: ContextBridge;
    goBack: () => void;
};
