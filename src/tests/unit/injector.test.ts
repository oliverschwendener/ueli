import { Injector } from "../../ts/injector";
import { platform } from "os";
import { OperatingSystem } from "../../ts/operating-system";
import { WindowsIconManager } from "../../ts/icon-manager/windows-icon-manager";
import { MacOsIconManager } from "../../ts/icon-manager/mac-os-icon-manager";
import { Windows10SettingsSearchPlugin } from "../../ts/search-plugins/windows-10-settings-plugin";
import { MacOsSettingsPlugin } from "../../ts/search-plugins/mac-os-settings-plugin";
import { WindowsProgramRepository } from "../../ts/programs-plugin/windows-program-repository";
import { MacOsProgramRepository } from "../../ts/programs-plugin/macos-program-repository";

const winPlatformString = "win32";
const macOsPlatformString = "darwin";

describe(Injector.name, () => {
    describe(Injector.getDirectorySeparator.name, () => {
        it("should return the correct directory separator", () => {
            const actual = Injector.getDirectorySeparator(platform());

            const expected = platform() === "win32"
                ? "\\"
                : "/";

            expect(actual).toBe(expected);
        });
    });

    describe(Injector.getFileExecutionCommand.name, () => {
        it("should return a file execution command", () => {
            const actual = Injector.getFileExecutionCommand(platform(), "");
            expect(actual).not.toBe(undefined);
            expect(actual).not.toBe(null);
        });
    });

    describe(Injector.getFileLocationExecutionCommand.name, () => {
        it("should return a file location execution command", () => {
            const actual = Injector.getFileLocationExecutionCommand(platform(), "");
            expect(actual).not.toBe(undefined);
            expect(actual).not.toBe(null);
        });
    });

    describe(Injector.getFilePathRegExp.name, () => {
        it("should return a valid file path regexp", () => {
            const filePathRegexp = Injector.getFilePathRegExp(platform());

            expect(filePathRegexp).not.toBe(undefined);
            expect(filePathRegexp).not.toBe(null);

            let regexIsValid = true;

            try {
                const regexp = new RegExp(filePathRegexp);
            } catch (error) {
                regexIsValid = false;
            }

            expect(regexIsValid).toBe(true);
        });
    });

    describe(Injector.getIconManager.name, () => {
        it("should return an icon manager for the current OS", () => {
            const iconManager = Injector.getIconManager(platform());

            const actual = platform() === "win32"
                ? iconManager instanceof WindowsIconManager
                : iconManager instanceof MacOsIconManager;

            expect(iconManager).not.toBe(undefined);
            expect(iconManager).not.toBe(null);
            expect(actual).toBe(true);
        });
    });

    describe(Injector.getOpenUrlWithDefaultBrowserCommand.name, () => {
        it("should return an command to open up default browser with URL", () => {
            const actual = Injector.getOpenUrlWithDefaultBrowserCommand(platform(), "");
            expect(actual).not.toBe(undefined);
            expect(actual).not.toBe(null);
        });
    });

    describe(Injector.getOperatingSystemSettingsPlugin.name, () => {
        it("should return an operating system settings plugin for the current OS", () => {
            const osSystemSettingsPlugin = Injector.getOperatingSystemSettingsPlugin(platform());

            const actual = platform() === "win32"
                ? osSystemSettingsPlugin instanceof Windows10SettingsSearchPlugin
                : osSystemSettingsPlugin instanceof MacOsSettingsPlugin;

            expect(osSystemSettingsPlugin).not.toBe(undefined);
            expect(osSystemSettingsPlugin).not.toBe(null);
            expect(actual).toBe(true);
        });
    });

    describe(Injector.getProgramRepository.name, () => {
        it("should return a program repository for the current OS", () => {
            const programRepository = Injector.getProgramRepository(platform());

            const actual = platform() === "win32"
                ? programRepository instanceof WindowsProgramRepository
                : programRepository instanceof MacOsProgramRepository;

            expect(programRepository).not.toBe(undefined);
            expect(programRepository).not.toBe(null);
            expect(actual).toBe(true);
        });
    });

    describe(Injector.getStyleSheetPath.name, () => {
        it("should return a stylesheet path", () => {
            const styleSheetPath = Injector.getStyleSheetPath(platform());

            expect(styleSheetPath).not.toBe(undefined);
            expect(styleSheetPath).not.toBe(null);
        });
    });

    describe(Injector.getTrayIconPath.name, () => {
        it("should return a tray icon path", () => {
            const trayIconPath = Injector.getTrayIconPath(platform(), "");
            expect(trayIconPath).not.toBe(undefined);
            expect(trayIconPath).not.toBe(null);
        });
    });

    describe(Injector.getWebUrlRegExp.name, () => {
        it("should return a valid web url regexp", () => {
            const webUrlRegexp = Injector.getWebUrlRegExp();
            expect(webUrlRegexp).not.toBe(undefined);
            expect(webUrlRegexp).not.toBe(null);

            let regexIsValid = true;

            try {
                const regexp = new RegExp(webUrlRegexp);
            } catch (error) {
                regexIsValid = false;
            }

            expect(regexIsValid).toBe(true);
        });
    });
});
