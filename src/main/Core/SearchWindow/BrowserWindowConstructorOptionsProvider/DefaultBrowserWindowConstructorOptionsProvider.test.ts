import { join } from "path";

import type { AppIconFilePathResolver } from "@Core/AppIconFilePathResolver";
import type { SettingsManager } from "@Core/SettingsManager";
import type { App, BrowserWindowConstructorOptions, Display, Screen } from "electron";
import { describe, expect, it, vi } from "vitest";

import { DefaultBrowserWindowConstructorOptionsProvider } from "./DefaultBrowserWindowConstructorOptionsProvider";
import { defaultWindowSize } from "./defaultWindowSize";

const screen = <Screen>{ getPrimaryDisplay: () => <Display>{ workAreaSize: { width: 1366, height: 728 } } };

describe(DefaultBrowserWindowConstructorOptionsProvider, () => {
    describe(DefaultBrowserWindowConstructorOptionsProvider.prototype.get, () => {
        it("should use the default settings", () => {
            const getValueMock = vi.fn();

            const app = <App>{ isPackaged: true };
            const settingsManager = <SettingsManager>{ getValue: (k, d) => getValueMock(k, d) };
            const appIconFilePathResolver = <AppIconFilePathResolver>{
                resolve: () => "appIconFilePath",
            };

            expect(
                new DefaultBrowserWindowConstructorOptionsProvider(
                    app,
                    settingsManager,
                    appIconFilePathResolver,
                    screen,
                ).get(),
            ).toEqual(<BrowserWindowConstructorOptions>{
                width: defaultWindowSize.width,
                height: defaultWindowSize.height,
                alwaysOnTop: undefined,
                show: undefined,
                frame: false,
                icon: "appIconFilePath",
                webPreferences: {
                    spellcheck: false,
                    preload: join(__dirname, "..", "preload", "index.js"),
                    allowRunningInsecureContent: false,
                    webSecurity: true,
                    devTools: false,
                },
            });

            expect(getValueMock).toHaveBeenCalledWith("window.showOnStartup", true);
            expect(getValueMock).toHaveBeenCalledWith("window.alwaysOnTop", false);
            expect(getValueMock).toHaveBeenCalledWith("window.useCustomSize", false);
        });

        it("should use the custom startup size, clamped to the primary display's work area", () => {
            const settings: Record<string, unknown> = {
                "window.useCustomSize": true,
                "window.startupWidth": 900,
                "window.startupHeight": 5000,
            };

            const app = <App>{ isPackaged: true };
            const settingsManager = <SettingsManager>{
                getValue: (key, defaultValue) => (key in settings ? settings[key] : defaultValue),
            };
            const appIconFilePathResolver = <AppIconFilePathResolver>{ resolve: () => "appIconFilePath" };

            const { width, height } = new DefaultBrowserWindowConstructorOptionsProvider(
                app,
                settingsManager,
                appIconFilePathResolver,
                screen,
            ).get();

            expect({ width, height }).toEqual({ width: 900, height: 728 });
        });

        it("should allow insecure content and disable web security if app is not packaged", () => {
            const getValueMock = vi.fn();

            const app = <App>{ isPackaged: false };
            const settingsManager = <SettingsManager>{ getValue: (k, d) => getValueMock(k, d) };
            const appIconFilePathResolver = <AppIconFilePathResolver>{
                resolve: () => "appIconFilePath",
            };

            const { webPreferences } = new DefaultBrowserWindowConstructorOptionsProvider(
                app,
                settingsManager,
                appIconFilePathResolver,
                screen,
            ).get();

            expect(webPreferences?.webSecurity).toBe(false);
            expect(webPreferences?.allowRunningInsecureContent).toBe(true);
            expect(webPreferences?.devTools).toBe(true);
        });
    });
});
