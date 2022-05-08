import { homedir, platform } from "os";
import { getCurrentOperatingSystem } from "../helpers/operating-system-helpers";
import { OperatingSystem } from "../operating-system";

export interface ApplicationSearchOptions {
    applicationFolders: string[];
    applicationFileExtensions: string[];
    enabled: boolean;
    showFullFilePath: boolean;
    useNativeIcons: boolean;
    useNativeName: boolean;
}

const windowsApplicationSearchOptions: ApplicationSearchOptions = {
    applicationFileExtensions: [".lnk", ".appref-ms", ".url", ".exe"],
    applicationFolders: [
        "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs",
        `${homedir()}\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu`,
        `${homedir()}\\Desktop`,
    ],
    enabled: true,
    showFullFilePath: false,
    useNativeIcons: true,
    useNativeName: false,
};

const macOsApplicationSearchOptions: ApplicationSearchOptions = {
    applicationFileExtensions: [".app"],
    applicationFolders: [
        "/Applications",
        "/System/Library/CoreServices",
        "/System/Applications",
        `${homedir()}/Applications`,
    ],
    enabled: true,
    showFullFilePath: false,
    useNativeIcons: true,
    useNativeName: false,
};

export const defaultApplicationSearchOptions =
    getCurrentOperatingSystem(platform()) === OperatingSystem.Windows
        ? windowsApplicationSearchOptions
        : macOsApplicationSearchOptions;
