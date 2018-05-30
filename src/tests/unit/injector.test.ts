import { Injector } from "../../ts/injector";
import { platform } from "os";
import { OperatingSystem } from "../../ts/operating-system";
import { WindowsIconManager } from "../../ts/icon-manager/windows-icon-manager";
import { MacOsIconManager } from "../../ts/icon-manager/mac-os-icon-manager";
import { Windows10SettingsSearchPlugin } from "../../ts/search-plugins/windows-10-settings-plugin";
import { MacOsSettingsPlugin } from "../../ts/search-plugins/mac-os-settings-plugin";
import { WindowsProgramRepository } from "../../ts/programs-plugin/windows-program-repository";
import { MacOsProgramRepository } from "../../ts/programs-plugin/macos-program-repository";
import { DirectorySeparator } from "../../ts/directory-separator";
import { join } from "path";
import { FileExecutionCommandBuilder } from "../../ts/builders/file-execution-command-builder";
import { FileLocationExecutionCommandBuilder } from "../../ts/builders/file-location-execution-command-builder";
import { FilePathRegex } from "../../ts/file-path-regex";
import { OpenUrlWithDefaultBrowserCommandBuilder } from "../../ts/builders/open-url-with-default-browser-command-builder";
import { SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG } from "constants";
import { StylesheetPath } from "../../ts/builders/stylesheet-path-builder";
import { TrayIconPathBuilder } from "../../ts/builders/tray-icon-path-builder";
import { OperatingSystemNotSupportedError } from "../../ts/errors/operatingsystem-not-supported-error";

const win = "win32";
const mac = "darwin";
const testFilePath = join("example", "file", "path");
const testUrl = "https://github.com";

describe(Injector.name, () => {
    describe(Injector.getDirectorySeparator.name, () => {
        it("should return the correct directory separator", () => {
            const actualWin = Injector.getDirectorySeparator(win);
            const actualMac = Injector.getDirectorySeparator(mac);

            expect(actualWin).toBe(DirectorySeparator.WindowsDirectorySeparator);
            expect(actualMac).toBe(DirectorySeparator.macOsDirectorySeparator);
        });
    });

    describe(Injector.getFileExecutionCommand.name, () => {
        it("should return a file execution command", () => {
            const actualWin = Injector.getFileExecutionCommand(win, testFilePath);
            const actualMac = Injector.getFileExecutionCommand(mac, testFilePath);

            expect(actualWin).toBe(FileExecutionCommandBuilder.buildWindowsFileExecutionCommand(testFilePath));
            expect(actualMac).toBe(FileExecutionCommandBuilder.buildMacOsFileExecutionCommand(testFilePath));
        });
    });

    describe(Injector.getFileLocationExecutionCommand.name, () => {
        it("should return a file location execution command", () => {
            const actualWin = Injector.getFileLocationExecutionCommand(win, testFilePath);
            const actualMac = Injector.getFileLocationExecutionCommand(mac, testFilePath);

            expect(actualWin).toBe(FileLocationExecutionCommandBuilder.buildWindowsLocationExecutionCommand(testFilePath));
            expect(actualMac).toBe(FileLocationExecutionCommandBuilder.buildMacOsLocationExecutionCommand(testFilePath));
        });
    });

    describe(Injector.getFilePathRegExp.name, () => {
        it("should return a valid file path regexp", () => {
            const actualWin = Injector.getFilePathRegExp(win);
            const actualMac = Injector.getFilePathRegExp(mac);

            expect(actualWin.source).toBe(FilePathRegex.windowsFilePathRegExp.source);
            expect(actualMac.source).toBe(FilePathRegex.macOsFilePathRegexp.source);
        });
    });

    describe(Injector.getIconManager.name, () => {
        it("should return an icon manager", () => {
            const actualWin = Injector.getIconManager(win);
            const acutalMac = Injector.getIconManager(mac);

            expect(actualWin instanceof WindowsIconManager).toBe(true);
            expect(acutalMac instanceof MacOsIconManager).toBe(true);
        });
    });

    describe(Injector.getOpenUrlWithDefaultBrowserCommand.name, () => {
        it("should return an command to open up default browser with URL", () => {
            const actualWin = Injector.getOpenUrlWithDefaultBrowserCommand(win, testUrl);
            const acutalMac = Injector.getOpenUrlWithDefaultBrowserCommand(mac, testUrl);

            expect(actualWin).toBe(OpenUrlWithDefaultBrowserCommandBuilder.buildWindowsCommand(testUrl));
            expect(acutalMac).toBe(OpenUrlWithDefaultBrowserCommandBuilder.buildMacCommand(testUrl));
        });
    });

    describe(Injector.getOperatingSystemSettingsPlugin.name, () => {
        it("should return an operating system settings search plugin", () => {
            const actualWin = Injector.getOperatingSystemSettingsPlugin(win);
            const actualMac = Injector.getOperatingSystemSettingsPlugin(mac);

            expect(actualWin instanceof Windows10SettingsSearchPlugin).toBe(true);
            expect(actualMac instanceof MacOsSettingsPlugin).toBe(true);
        });
    });

    describe(Injector.getStyleSheetPath.name, () => {
        it("should return a stylesheet path", () => {
            const actualWin = Injector.getStyleSheetPath(win);
            const actualMac = Injector.getStyleSheetPath(mac);

            expect(actualWin).toBe(StylesheetPath.Windows);
            expect(actualMac).toBe(StylesheetPath.MacOs);
        });
    });

    describe(Injector.getTrayIconPath.name, () => {
        it("should return a tray icon path", () => {
            const actualWin = Injector.getTrayIconPath(win, testFilePath);
            const actualMac = Injector.getTrayIconPath(mac, testFilePath);

            expect(actualWin).toBe(TrayIconPathBuilder.buildWindowsTrayIconPath(testFilePath));
            expect(actualMac).toBe(TrayIconPathBuilder.buildMacOsTrayIconPath(testFilePath));
        });
    });

    describe(Injector.getWebUrlRegExp.name, () => {
        it("should return a valid web url regexp", () => {
            const webUrlRegexp = Injector.getWebUrlRegExp();

            expect(webUrlRegexp).not.toBe(undefined);
            expect(webUrlRegexp).not.toBe(null);

            let regexIsValid: boolean;

            try {
                const regexp = new RegExp(webUrlRegexp);
                regexIsValid = true;
            } catch (error) {
                regexIsValid = false;
            }

            expect(regexIsValid).toBe(true);
        });
    });
});
