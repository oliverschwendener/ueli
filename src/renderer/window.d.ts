import type { ContextBridge } from "@common/Core";

export declare global {
    interface Window {
        ContextBridge: ContextBridge;
    }
}
