import { exec } from "child_process";

export function executeFilePathLocationWindows(filePath: string): Promise<void> {
    return executeFilePathLocation(`start explorer.exe /select,"${filePath}"`);
}

export function executeFilePathLocationMacOs(filePath: string): Promise<void> {
    return executeFilePathLocation(`open -R "${filePath}"`);
}

function executeFilePathLocation(command: string): Promise<void> {
    return new Promise((resolve, reject) => {
        exec(command, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
