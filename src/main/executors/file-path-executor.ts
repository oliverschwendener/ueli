import { FileHelpers } from "../helpers/file-helpers";
import { exec } from "child_process";
import shell = require("node-powershell");
import osascript = require("node-osascript");

export function executeFilePathWindows(filePath: string, privileged: boolean): Promise<void> {
    return privileged
        ? executeFilePathWindowsAsPrivileged(filePath)
        : executeFilePath(`start explorer "${filePath}"`, filePath);
}

export function executeFilePathMacOs(filePath: string, privileged: boolean): Promise<void> {
    return privileged
        ? executeFilePathMacOsAsPrivileged(filePath)
        : executeFilePath(`open "${filePath}"`, filePath);
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

function executeFilePathWindowsAsPrivileged(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const ps = new shell({
            debugMsg: false,
            executionPolicy: "Bypass",
            noProfile: true,
        });

        ps.addCommand(`Start-Process -Verb runas "${filePath}"`);
        ps.invoke()
            .then(() =>  resolve())
            .catch((err) => reject(err))
            .then(() => ps.dispose());
    });
}

function executeFilePathMacOsAsPrivileged(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        osascript.execute(`do shell script \"open '${filePath}'\" with administrator privileges`, {}, (err: any) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}