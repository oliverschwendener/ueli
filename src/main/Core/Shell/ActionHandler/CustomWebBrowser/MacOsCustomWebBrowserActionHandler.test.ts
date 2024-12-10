import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { SettingsManager } from "@Core/SettingsManager";
import { describe, expect, it, vi } from "vitest";
import { MacOsCustomWebBrowserActionHandler } from "./MacOsCustomWebBrowserActionHandler";

describe(MacOsCustomWebBrowserActionHandler, () => {
    describe(MacOsCustomWebBrowserActionHandler.prototype.isEnabled, () => {
        it("should return false if the setting 'general.browser.useDefaultWebBrowser' is true", async () => {
            const getValueMock = vi.fn().mockReturnValue(false);
            const settingsManager = <SettingsManager>{ getValue: (k, d) => getValueMock(k, d) };
            const commandlineUtility = <CommandlineUtility>{};

            expect(new MacOsCustomWebBrowserActionHandler(settingsManager, commandlineUtility).isEnabled()).toBe(false);
            expect(getValueMock).toHaveBeenCalledWith("general.browser.useDefaultWebBrowser", true);
        });

        it("should return false if the setting 'general.browser.useDefaultWebBrowser' is false but the custom browser name is not set", async () => {
            const getValueMock = vi.fn().mockImplementation((k) => {
                if (k === "general.browser.useDefaultWebBrowser") {
                    return false;
                }

                if (k === "general.browser.customWebBrowserName") {
                    return "";
                }

                throw new Error("Unexpected call to getValue");
            });

            const settingsManager = <SettingsManager>{ getValue: (k, d) => getValueMock(k, d) };
            const commandlineUtility = <CommandlineUtility>{};

            expect(new MacOsCustomWebBrowserActionHandler(settingsManager, commandlineUtility).isEnabled()).toBe(false);
            expect(getValueMock).toHaveBeenCalledWith("general.browser.useDefaultWebBrowser", true);
            expect(getValueMock).toHaveBeenCalledWith("general.browser.customWebBrowserName", "");
        });

        it("should return true if the setting 'general.browser.useDefaultWebBrowser' is false and the custom browser name is set", async () => {
            const getValueMock = vi.fn().mockImplementation((k) => {
                if (k === "general.browser.useDefaultWebBrowser") {
                    return false;
                }

                if (k === "general.browser.customWebBrowserName") {
                    return "Google Chrome";
                }

                throw new Error("Unexpected call to getValue");
            });

            const settingsManager = <SettingsManager>{ getValue: (k, d) => getValueMock(k, d) };
            const commandlineUtility = <CommandlineUtility>{};

            expect(new MacOsCustomWebBrowserActionHandler(settingsManager, commandlineUtility).isEnabled()).toBe(true);
            expect(getValueMock).toHaveBeenCalledWith("general.browser.useDefaultWebBrowser", true);
            expect(getValueMock).toHaveBeenCalledWith("general.browser.customWebBrowserName", "");
        });
    });

    describe(MacOsCustomWebBrowserActionHandler.prototype.openUrl, () => {
        it("should open the URL with the custom web browser", async () => {
            const executeCommandMock = vi.fn().mockReturnValue(Promise.resolve());
            const getValueMock = vi.fn().mockReturnValue("My Custom Browser");
            const settingsManager = <SettingsManager>{ getValue: (k, d) => getValueMock(k, d) };
            const commandlineUtility = <CommandlineUtility>{ executeCommand: (c) => executeCommandMock(c) };

            await new MacOsCustomWebBrowserActionHandler(settingsManager, commandlineUtility).openUrl(
                "https://example.com",
            );

            expect(executeCommandMock).toHaveBeenCalledWith('open -a "My Custom Browser" "https://example.com"');
            expect(getValueMock).toHaveBeenCalledWith("general.browser.customWebBrowserName", "");
        });
    });
});
