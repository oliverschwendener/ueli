import type { ContextBridge } from "@common/ContextBridge";

export type ExtensionProps = {
    contextBridge: ContextBridge;
    goBack: () => void;
};
