import { FileHelpers } from "../helpers/file-helpers";
import { exec } from "child_process";

export function executeFilePathWindows(filePath: string): Promise<void> {
    return executeFilePath(`start explorer "${filePath}"`);
}

export function executeFilePathMacOs(filePath: string): Promise<void> {
    return executeFilePath(`open "${filePath}"`);
}

function executeFilePath(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        FileHelpers.fileExists(filePath)
            .then((exists) => {
                if (exists) {
                    const command = `open "${filePath}"`;
                    exec(command, (err) => {
                        if (err) {
                            reject(`Error while opening file: ${err}`);
                        } else {
                            resolve();
                        }
                    });
                } else {
                    reject("Error while opening file: file does not exist.");
                }
            });
    });
}
