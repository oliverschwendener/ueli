import { shell } from "electron";

export function executeFilePathLocation(filePath: string): Promise<void> {
    return new Promise((resolve) => {
        shell.showItemInFolder(filePath);
        resolve();
    });
}
