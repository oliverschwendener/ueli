import type { ContextBridge } from "../electron/preload/ContextBridge";

export declare global {
    interface Window {
        ContextBridge: ContextBridge;
    }
}
