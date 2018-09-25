import { platform } from "os";
import { UserConfigOptions } from "./../user-config/user-config-options";
import { OperatingSystemHelpers } from "./../helpers/operating-system-helpers";
import { OperatingSystem } from "./../operating-system";
import { WindowsIconSet } from "./../icon-sets/windows-icon-set";
import { MacOsIconSet } from "./../icon-sets/mac-os-icon-set";
import { defaultWindowsApplicationFolders, defaultMacOsApplicationFolders } from "./default-application-folders";
import { defaultWindowsApplicationFileExtensions, defaultMacOsApplicationFileExtensions } from "./default-application-file-extensions";
import { defaultFileSearchOptions } from "./default-file-search-options";
import { defaultWebSearches } from "./default-web-searches";

export class DefaultUserConfigManager {
    public static getDefaultUserConfig(): UserConfigOptions {
        const currentOperatingSystem = OperatingSystemHelpers.getOperatingSystemFromString(platform());

        return {
            allowMouseInteraction: true,
            alwaysShowOnPrimaryDisplay: false,
            applicationFileExtensions: currentOperatingSystem === OperatingSystem.Windows ? defaultWindowsApplicationFileExtensions : defaultMacOsApplicationFileExtensions,
            applicationFolders: currentOperatingSystem === OperatingSystem.Windows ? defaultWindowsApplicationFolders : defaultMacOsApplicationFolders,
            autoStartApp: true,
            colorTheme: "dark",
            customCommands: [],
            fallbackWebSearches: [],
            fileSearchOptions: defaultFileSearchOptions,
            hotKey: "alt+space",
            iconSet: currentOperatingSystem === OperatingSystem.Windows ? new WindowsIconSet() : new MacOsIconSet(),
            logExecution: true,
            maxSearchResultCount: 8,
            maxWindowHeight: 560,
            rescanInterval: 60,
            searchEngineThreshold: 0.4,
            searchEnvironmentVariables: false,
            searchOperatingSystemSettings: true,
            searchResultDescriptionFontSize: 14,
            searchResultHeight: 60,
            searchResultNameFontSize: 20,
            shortcuts: [],
            showTrayIcon: true,
            userInputFontSize: 36,
            userInputHeight: 80,
            userStylesheet: "",
            webSearches:  defaultWebSearches,
            windowWidth: 860,
        };
    }
}
