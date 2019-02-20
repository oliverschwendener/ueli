import osascript = require("node-osascript");
import { executeCommand } from "./command-executor";

export function executeFilePathWindows(filePath: string, privileged: boolean): Promise<void> {
    return privileged
        ? executeFilePathWindowsAsPrivileged(filePath)
        : executeCommand(`start explorer "${filePath}"`);
}

export function executeFilePathMacOs(filePath: string, privileged: boolean): Promise<void> {
    return privileged
        ? executeFilePathMacOsAsPrivileged(filePath)
        : executeCommand(`open "${filePath}"`);
}

function executeFilePathWindowsAsPrivileged(filePath: string): Promise<void> {
    return executeCommand(`powershell -Command "& {Start-Process -Verb runas '${filePath}'}"`);
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
