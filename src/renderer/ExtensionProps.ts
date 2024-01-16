import type { ContextBridge } from "@common/Core";

export type ExtensionProps = {
    contextBridge: ContextBridge;
    goBack: () => void;
};
