import type { SettingsManager } from "@Core/SettingsManager";
import type { Size } from "electron";
import { describe, expect, it } from "vitest";

import { defaultWindowSize } from "./defaultWindowSize";
import { getStartupWindowSize, minimumWindowSize } from "./getStartupWindowSize";

const createSettingsManager = (settings: Record<string, unknown>) =>
    <SettingsManager>{
        getValue: (key, defaultValue) => (key in settings ? settings[key] : defaultValue),
    };

const workAreaSize: Size = { width: 1920, height: 1080 };

describe(getStartupWindowSize, () => {
    it("should return the default size when the custom startup size is disabled", () => {
        const settingsManager = createSettingsManager({
            "window.useCustomSize": false,
            "window.startupWidth": 900,
            "window.startupHeight": 700,
        });

        expect(getStartupWindowSize(settingsManager, workAreaSize)).toEqual(defaultWindowSize);
    });

    it("should return the default size when no custom startup size settings exist", () => {
        expect(getStartupWindowSize(createSettingsManager({}), workAreaSize)).toEqual(defaultWindowSize);
    });

    it("should return the custom size when the custom startup size is enabled", () => {
        const settingsManager = createSettingsManager({
            "window.useCustomSize": true,
            "window.startupWidth": 900,
            "window.startupHeight": 700,
        });

        expect(getStartupWindowSize(settingsManager, workAreaSize)).toEqual({ width: 900, height: 700 });
    });

    it("should use the default dimensions when the custom startup size is enabled but no dimensions are set", () => {
        const settingsManager = createSettingsManager({ "window.useCustomSize": true });

        expect(getStartupWindowSize(settingsManager, workAreaSize)).toEqual(defaultWindowSize);
    });

    it("should clamp the custom size to the minimum window size", () => {
        const settingsManager = createSettingsManager({
            "window.useCustomSize": true,
            "window.startupWidth": 10,
            "window.startupHeight": 10,
        });

        expect(getStartupWindowSize(settingsManager, workAreaSize)).toEqual(minimumWindowSize);
    });

    it("should clamp the custom size to the work area", () => {
        const settingsManager = createSettingsManager({
            "window.useCustomSize": true,
            "window.startupWidth": 5000,
            "window.startupHeight": 5000,
        });

        expect(getStartupWindowSize(settingsManager, { width: 1366, height: 728 })).toEqual({
            width: 1366,
            height: 728,
        });
    });

    it("should fall back to the default dimensions when the custom size is not a valid number", () => {
        const settingsManager = createSettingsManager({
            "window.useCustomSize": true,
            "window.startupWidth": "wide",
            "window.startupHeight": NaN,
        });

        expect(getStartupWindowSize(settingsManager, workAreaSize)).toEqual(defaultWindowSize);
    });

    it("should round fractional dimensions", () => {
        const settingsManager = createSettingsManager({
            "window.useCustomSize": true,
            "window.startupWidth": 900.6,
            "window.startupHeight": 700.2,
        });

        expect(getStartupWindowSize(settingsManager, workAreaSize)).toEqual({ width: 901, height: 700 });
    });
});
