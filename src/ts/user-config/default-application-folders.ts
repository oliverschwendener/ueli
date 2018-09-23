import { homedir } from "os";

export const defaultWindowsApplicationFolders = [
    "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs",
    `${homedir()}\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu`,
    `${homedir()}\\Desktop`,
];

export const defaultMacOsApplicationFolders = [
    "/Applications",
    `${homedir()}/Applications`,
];
