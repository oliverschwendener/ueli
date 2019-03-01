import { basename } from "path";

export const isDev = (): boolean => {
    return basename(process.execPath)
        .toLowerCase()
        .replace(".exe", "")
        .endsWith("electron");
};
