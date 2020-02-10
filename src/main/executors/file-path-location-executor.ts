import { shell } from "electron";

export function openFileLocation(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const success = shell.showItemInFolder(filePath);
        if (success) {
            resolve();
        } else {
            reject(`Could not open the location of ${filePath}`);
        }
    });
}
