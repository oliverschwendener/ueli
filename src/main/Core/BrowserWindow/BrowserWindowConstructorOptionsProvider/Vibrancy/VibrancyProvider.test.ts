import type { SettingsManager } from "@Core/SettingsManager";
import type { BrowserWindowConstructorOptions } from "electron";
import { describe, expect, it, vi } from "vitest";
import { VibrancyProvider } from "./VibrancyProvider";

describe(VibrancyProvider, () => {
    describe(VibrancyProvider.prototype.get, () => {
        const testGet = ({
            expected,
            vibrancy,
        }: {
            expected: BrowserWindowConstructorOptions["vibrancy"];
            vibrancy: string;
        }) => {
            const settingsManager = <SettingsManager>{
                getValue: vi.fn().mockReturnValue(vibrancy),
                updateValue: vi.fn(),
            };

            expect(new VibrancyProvider(settingsManager).get()).toBe(expected);
            expect(settingsManager.getValue).toHaveBeenCalledWith("window.vibrancy", "None");
        };

        it("should return the correct vibrancy", () => {
            testGet({ vibrancy: "content", expected: "content" });
            testGet({ vibrancy: "fullscreen-ui", expected: "fullscreen-ui" });
            testGet({ vibrancy: "header", expected: "header" });
            testGet({ vibrancy: "hud", expected: "hud" });
            testGet({ vibrancy: "menu", expected: "menu" });
            testGet({ vibrancy: "popover", expected: "popover" });
            testGet({ vibrancy: "selection", expected: "selection" });
            testGet({ vibrancy: "sheet", expected: "sheet" });
            testGet({ vibrancy: "sidebar", expected: "sidebar" });
            testGet({ vibrancy: "titlebar", expected: "titlebar" });
            testGet({ vibrancy: "tooltip", expected: "tooltip" });
            testGet({ vibrancy: "under-page", expected: "under-page" });
            testGet({ vibrancy: "under-window", expected: "under-window" });
            testGet({ vibrancy: "window", expected: "window" });
            testGet({ vibrancy: "", expected: null });
            testGet({ vibrancy: " ", expected: null });
            testGet({ vibrancy: "Window", expected: null });
        });
    });
});
