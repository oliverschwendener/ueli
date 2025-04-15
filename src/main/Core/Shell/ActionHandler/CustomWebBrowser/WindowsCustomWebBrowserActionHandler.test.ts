import type { PowershellUtility } from "@Core/PowershellUtility";
import type { SettingsManager } from "@Core/SettingsManager";
import { describe, expect, it, vi } from "vitest";
import { WindowsCustomWebBrowserActionHandler } from "./WindowsCustomWebBrowserActionHandler";

describe(WindowsCustomWebBrowserActionHandler, () => {
    describe(WindowsCustomWebBrowserActionHandler.prototype.isEnabled, () => {
        it("should return false if system default browser should be used", () => {
            const getValueMock = vi.fn().mockReturnValue(true);
            const settingsManager = <SettingsManager>{ getValue: (k, d) => getValueMock(k, d) };

            const actionHandler = new WindowsCustomWebBrowserActionHandler(<PowershellUtility>{}, settingsManager);

            expect(actionHandler.isEnabled()).toBe(false);
            expect(getValueMock).toHaveBeenCalledWith("general.browser.useDefaultWebBrowser", true);
        });

        it("should return false if custom browser should be used but executable file path is not set", () => {
            const getValueMock = vi.fn().mockImplementation((k) => {
                if (k === "general.browser.useDefaultWebBrowser") {
                    return false;
                }

                if (k === "general.browser.customWebBrowser.executableFilePath") {
                    return "";
                }

                throw new Error("Unexpected call to getValue");
            });

            const settingsManager = <SettingsManager>{ getValue: (k, d) => getValueMock(k, d) };

            const actionHandler = new WindowsCustomWebBrowserActionHandler(<PowershellUtility>{}, settingsManager);

            expect(actionHandler.isEnabled()).toBe(false);
            expect(getValueMock).toHaveBeenCalledWith("general.browser.useDefaultWebBrowser", true);
            expect(getValueMock).toHaveBeenCalledWith("general.browser.customWebBrowser.executableFilePath", "");
        });

        it("should return false if custom browser should be used, executable file path is set, but commandline arguments do not contain url placeholder", () => {
            const getValueMock = vi.fn().mockImplementation((k) => {
                if (k === "general.browser.useDefaultWebBrowser") {
                    return false;
                }

                if (k === "general.browser.customWebBrowser.executableFilePath") {
                    return "path";
                }

                if (k === "general.browser.customWebBrowser.commandlineArguments") {
                    return "-some -argument -list";
                }

                throw new Error("Unexpected call to getValue");
            });

            const settingsManager = <SettingsManager>{ getValue: (k, d) => getValueMock(k, d) };

            const actionHandler = new WindowsCustomWebBrowserActionHandler(<PowershellUtility>{}, settingsManager);

            expect(actionHandler.isEnabled()).toBe(false);
            expect(getValueMock).toHaveBeenCalledWith("general.browser.useDefaultWebBrowser", true);
            expect(getValueMock).toHaveBeenCalledWith("general.browser.customWebBrowser.executableFilePath", "");
            expect(getValueMock).toHaveBeenCalledWith(
                "general.browser.customWebBrowser.commandlineArguments",
                "{{url}}",
            );
        });

        it("should return true if custom browser should be used, executable file path is set and commandline arguments contain url placeholder", () => {
            const getValueMock = vi.fn().mockImplementation((k) => {
                if (k === "general.browser.useDefaultWebBrowser") {
                    return false;
                }

                if (k === "general.browser.customWebBrowser.executableFilePath") {
                    return "path";
                }

                if (k === "general.browser.customWebBrowser.commandlineArguments") {
                    return "-some -argument -list {{url}}";
                }

                throw new Error("Unexpected call to getValue");
            });

            const settingsManager = <SettingsManager>{ getValue: (k, d) => getValueMock(k, d) };

            const actionHandler = new WindowsCustomWebBrowserActionHandler(<PowershellUtility>{}, settingsManager);

            expect(actionHandler.isEnabled()).toBe(true);
            expect(getValueMock).toHaveBeenCalledWith("general.browser.useDefaultWebBrowser", true);
            expect(getValueMock).toHaveBeenCalledWith("general.browser.customWebBrowser.executableFilePath", "");
            expect(getValueMock).toHaveBeenCalledWith(
                "general.browser.customWebBrowser.commandlineArguments",
                "{{url}}",
            );
        });
    });

    describe(WindowsCustomWebBrowserActionHandler.prototype.openUrl, () => {
        it("should open the browser with powershell and pass the commandline arguments", async () => {
            const getValueMock = vi.fn().mockImplementation((k) => {
                if (k === "general.browser.customWebBrowser.executableFilePath") {
                    return "path";
                }

                if (k === "general.browser.customWebBrowser.commandlineArguments") {
                    return "-some -argument -list {{url}}";
                }

                throw new Error("Unexpected call to getValue");
            });

            const executeCommandMock = vi.fn().mockReturnValue(Promise.resolve());

            const settingsManager = <SettingsManager>{ getValue: (k, d) => getValueMock(k, d) };
            const powershellUtility = <PowershellUtility>{ executeCommand: (c) => executeCommandMock(c) };

            const actionHandler = new WindowsCustomWebBrowserActionHandler(powershellUtility, settingsManager);

            await actionHandler.openUrl("https://example.com");

            expect(getValueMock).toHaveBeenCalledWith("general.browser.customWebBrowser.executableFilePath", "");

            expect(getValueMock).toHaveBeenCalledWith(
                "general.browser.customWebBrowser.commandlineArguments",
                "{{url}}",
            );

            expect(executeCommandMock).toHaveBeenCalledWith(
                `Start-Process -FilePath 'path' -ArgumentList '-some -argument -list https://example.com'`,
            );
        });
    });
});
