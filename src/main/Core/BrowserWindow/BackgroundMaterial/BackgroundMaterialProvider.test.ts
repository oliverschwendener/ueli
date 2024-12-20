import type { SettingsManager } from "@Core/SettingsManager";
import type { BrowserWindowConstructorOptions } from "electron";
import { describe, expect, it, vi } from "vitest";
import { BackgroundMaterialProvider } from "./BackgroundMaterialProvider";

describe(BackgroundMaterialProvider, () => {
    describe(BackgroundMaterialProvider.prototype.get, () => {
        const testGet = ({
            expected,
            backgroundMaterial,
        }: {
            expected: BrowserWindowConstructorOptions["backgroundMaterial"];
            backgroundMaterial: string;
        }) => {
            const settingsManager = <SettingsManager>{
                getValue: vi.fn().mockReturnValue(backgroundMaterial),
                updateValue: vi.fn(),
            };

            expect(new BackgroundMaterialProvider(settingsManager).get()).toEqual(expected);
            expect(settingsManager.getValue).toHaveBeenCalledWith("window.backgroundMaterial", "Mica");
        };

        it("should return the correct background material", () => {
            testGet({ backgroundMaterial: "Acrylic", expected: "acrylic" });
            testGet({ backgroundMaterial: "Mica", expected: "mica" });
            testGet({ backgroundMaterial: "Tabbed", expected: "tabbed" });
            testGet({ backgroundMaterial: "None", expected: "none" });
            testGet({ backgroundMaterial: "", expected: "mica" });
            testGet({ backgroundMaterial: "acrylic", expected: "mica" });
            testGet({ backgroundMaterial: "mica", expected: "mica" });
            testGet({ backgroundMaterial: "tabbed", expected: "mica" });
            testGet({ backgroundMaterial: "auto", expected: "mica" });
        });
    });
});
