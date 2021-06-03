import { basename } from "path";

export const isDev = (processExecPath: string) => {
    return basename(processExecPath).toLowerCase().replace(".exe", "").endsWith("electron");
};
