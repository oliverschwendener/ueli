import { shell } from "electron";

export function openUrlInBrowser(url: string): Promise<void> {
    return shell.openExternal(url);
}
