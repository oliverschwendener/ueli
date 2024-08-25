import type { BrowserWindowConstructorOptions } from "electron";
import { describe, expect, it, vi } from "vitest";
import type { BackgroundMaterialProvider } from "./BackgroundMaterial";
import { WindowsBrowserWindowConstructorOptionsProvider } from "./WindowsBrowserWindowConstructorOptionsProvider";

describe(WindowsBrowserWindowConstructorOptionsProvider, () => {
    describe(WindowsBrowserWindowConstructorOptionsProvider.prototype.get, () => {
        it("should return the windows constructor options", () => {
            const defaultOptions = <BrowserWindowConstructorOptions>{
                frame: false,
                center: true,
            };

            const getBackgroundMaterialMock = vi.fn().mockReturnValue("acrylic");

            const backgroundMaterialProvider = <BackgroundMaterialProvider>{ get: () => getBackgroundMaterialMock() };

            const actual = new WindowsBrowserWindowConstructorOptionsProvider(
                defaultOptions,
                backgroundMaterialProvider,
            ).get();

            expect(actual).toEqual(<BrowserWindowConstructorOptions>{
                frame: false,
                center: true,
                autoHideMenuBar: true,
                backgroundMaterial: "acrylic",
            });

            expect(getBackgroundMaterialMock).toHaveBeenCalledOnce();
        });
    });
});
