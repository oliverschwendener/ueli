import { exec } from "child_process";

export function executeUrlWindows(url: string): Promise<void> {
    return executeUrl(`start explorer "${url}"`);
}

export function executeUrlMacOs(url: string): Promise<void> {
    return executeUrl(`open "${url}"`);
}

function executeUrl(command: string): Promise<void> {
    return new Promise((resolve, reject) => {
        exec(command, (err) => {
            if (err) {
                reject(`Error while executing URL: ${err}`);
            } else {
                resolve();
            }
        });
    });
}
