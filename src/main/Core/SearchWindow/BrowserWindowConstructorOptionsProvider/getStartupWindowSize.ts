import type { SettingsManager } from "@Core/SettingsManager";
import type { Size } from "electron";

import { defaultWindowSize } from "./defaultWindowSize";

export const minimumWindowSize: Size = {
    height: 200,
    width: 300,
};

const clamp = (value: number, fallback: number, min: number, max: number) =>
    Math.round(Math.min(Math.max(Number.isFinite(value) ? value : fallback, min), max));

// Custom sizes are clamped to the display's work area because settings can be shared across machines, so a size
// configured on a larger display must not overflow a smaller one.
export const getStartupWindowSize = (settingsManager: SettingsManager, workAreaSize: Size): Size => {
    if (!settingsManager.getValue<boolean>("window.useCustomSize", false)) {
        return defaultWindowSize;
    }

    return {
        width: clamp(
            settingsManager.getValue<number>("window.startupWidth", defaultWindowSize.width),
            defaultWindowSize.width,
            minimumWindowSize.width,
            workAreaSize.width,
        ),
        height: clamp(
            settingsManager.getValue<number>("window.startupHeight", defaultWindowSize.height),
            defaultWindowSize.height,
            minimumWindowSize.height,
            workAreaSize.height,
        ),
    };
};
