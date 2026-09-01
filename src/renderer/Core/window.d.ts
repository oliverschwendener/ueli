import type { ContextBridge } from "@shared/Core";

export declare global {
    interface Window {
        ContextBridge: ContextBridge;
    }
}
