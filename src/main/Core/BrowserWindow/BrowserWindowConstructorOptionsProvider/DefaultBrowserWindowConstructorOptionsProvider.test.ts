import type { SettingsManager } from "@Core/SettingsManager";
import type { App, BrowserWindowConstructorOptions } from "electron";
import { join } from "path";
import { describe, expect, it, vi } from "vitest";
import type { AppIconFilePathResolver } from "../AppIconFilePathResolver/AppIconFilePathResolver";
import { DefaultBrowserWindowConstructorOptionsProvider } from "./DefaultBrowserWindowConstructorOptionsProvider";
import { defaultWindowSize } from "./defaultWindowSize";

describe(DefaultBrowserWindowConstructorOptionsProvider, () => {
    describe(DefaultBrowserWindowConstructorOptionsProvider.prototype.get, () => {
        it("should use the default settings", () => {
            const getValueMock = vi.fn();

            const app = <App>{ isPackaged: true };
            const settingsManager = <SettingsManager>{ getValue: (k, d) => getValueMock(k, d) };
            const appIconFilePathResolver = <AppIconFilePathResolver>{ getAppIconFilePath: () => "appIconFilePath" };

            expect(
                new DefaultBrowserWindowConstructorOptionsProvider(app, settingsManager, appIconFilePathResolver).get(),
            ).toEqual(<BrowserWindowConstructorOptions>{
                width: defaultWindowSize.width,
                height: defaultWindowSize.height,
                alwaysOnTop: undefined,
                show: undefined,
                frame: false,
                icon: "appIconFilePath",
                webPreferences: {
                    spellcheck: false,
                    preload: join(__dirname, "..", "dist-preload", "index.js"),
                    allowRunningInsecureContent: false,
                    webSecurity: true,
                    devTools: false,
                },
            });

            expect(getValueMock).toHaveBeenCalledWith("window.showOnStartup", true);
            expect(getValueMock).toHaveBeenCalledWith("window.alwaysOnTop", false);
        });

        it("should allow insecure content and disable web security if app is not packaged", () => {
            const getValueMock = vi.fn();

            const app = <App>{ isPackaged: false };
            const settingsManager = <SettingsManager>{ getValue: (k, d) => getValueMock(k, d) };
            const appIconFilePathResolver = <AppIconFilePathResolver>{ getAppIconFilePath: () => "appIconFilePath" };

            const { webPreferences } = new DefaultBrowserWindowConstructorOptionsProvider(
                app,
                settingsManager,
                appIconFilePathResolver,
            ).get();

            expect(webPreferences?.webSecurity).toBe(false);
            expect(webPreferences?.allowRunningInsecureContent).toBe(true);
            expect(webPreferences?.devTools).toBe(true);
        });
    });
});
