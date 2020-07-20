import { shell } from "electron";

export function openFileLocation(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            shell.showItemInFolder(filePath);
            resolve();
        } catch (error) {
            reject(`Could not open the location of ${filePath}`);
        }
    });
}
