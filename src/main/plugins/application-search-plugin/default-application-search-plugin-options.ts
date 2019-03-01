import { ApplicationSearchOptions } from "./application-search-options";
import { homedir, platform } from "os";

const win: ApplicationSearchOptions = {
    applicationFileExtensions: [".lnk", ".appref-ms", ".url", ".exe"],
    applicationFolders: [
        "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs",
        `${homedir()}\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu`,
        `${homedir()}\\Desktop`,
    ],
    enabled: true,
};

const darwin: ApplicationSearchOptions = {
    applicationFileExtensions: [".app"],
    applicationFolders: [
        "/Applications",
        `${homedir()}/Applications`,
    ],
    enabled: true,
};

export const defaultApplicationSearchOptions = platform() === "win32"
    ? win
    : darwin;
