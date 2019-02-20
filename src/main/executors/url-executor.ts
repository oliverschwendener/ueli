import { shell } from "electron";

export function executeUrl(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
        shell.openExternal(url, undefined, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
