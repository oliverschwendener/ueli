import type { ContextBridge } from "@Shared/Core";

export declare global {
    interface Window {
        ContextBridge: ContextBridge;
    }
}
