import { homedir, platform } from "os";

export interface ApplicationSearchOptions {
    applicationFolders: string[];
    applicationFileExtensions: string[];
    enabled: boolean;
    showFullFilePath: boolean;
}

const win: ApplicationSearchOptions = {
    applicationFileExtensions: [".lnk", ".appref-ms", ".url", ".exe"],
    applicationFolders: [
        "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs",
        `${homedir()}\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu`,
        `${homedir()}\\Desktop`,
    ],
    enabled: true,
    showFullFilePath: false,
};

const darwin: ApplicationSearchOptions = {
    applicationFileExtensions: [".app"],
    applicationFolders: [
        "/Applications",
        "/System/Library/CoreServices",
        `${homedir()}/Applications`,
    ],
    enabled: true,
    showFullFilePath: false,
};

export const defaultApplicationSearchOptions = platform() === "win32"
    ? win
    : darwin;
