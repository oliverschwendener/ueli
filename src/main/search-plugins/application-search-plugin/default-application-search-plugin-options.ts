import { ApplicationSearchPluginOptions } from "./application-search-plugin-options";
import { homedir, platform } from "os";

const win: ApplicationSearchPluginOptions = {
    applicationFileExtensions: [".lnk", ".appref-ms", ".url", ".exe"],
    applicationFolders: [
        "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs",
        `${homedir()}\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu`,
        `${homedir()}\\Desktop`,
    ],
    defaultIcon: "",
};

const darwin: ApplicationSearchPluginOptions = {
    applicationFileExtensions: [".app"],
    applicationFolders: [
        "/Applications",
        `${homedir()}/Applications`,
    ],
    defaultIcon: "./img/default-mac-app-icon.png",
};

export const defaultApplicationSearchPluginOptions = platform() === "win32"
    ? win
    : darwin;
