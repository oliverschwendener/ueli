import { FileHelpers } from "../helpers/file-helpers";
import { exec } from "child_process";

export function executeFilePathWindows(filePath: string): Promise<void> {
    return executeFilePath(`start explorer "${filePath}"`, filePath);
}

export function executeFilePathMacOs(filePath: string): Promise<void> {
    return executeFilePath(`open "${filePath}"`, filePath);
}

function executeFilePath(command: string, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        FileHelpers.fileExists(filePath)
            .then((exists) => {
                if (exists) {
                    exec(command, (err) => {
                        if (err) {
                            reject(`Error while opening file: ${err}`);
                        } else {
                            resolve();
                        }
                    });
                } else {
                    reject(`Error while executing file: File "${filePath}" does not exist.`);
                }
            })
            .catch((err) => reject(err));
    });
}
