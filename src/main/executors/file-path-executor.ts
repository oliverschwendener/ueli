import { shell } from "electron";
import { exec } from "child_process";
import osascript = require("node-osascript");

export function executeFilePathWindows(filePath: string, privileged: boolean): Promise<void> {
    return privileged
        ? executeFilePathWindowsAsPrivileged(filePath)
        : executeFilePath(filePath);
}

export function executeFilePathMacOs(filePath: string, privileged: boolean): Promise<void> {
    return privileged
        ? executeFilePathMacOsAsPrivileged(filePath)
        : executeFilePath(filePath);
}

function executeFilePath(filePath: string): Promise<void> {
    return new Promise((resolve) => {
        shell.openItem(filePath);
        resolve();
    });
}

function executeFilePathWindowsAsPrivileged(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const command = `powershell -Command "& {Start-Process -Verb runas '${filePath}'}"`;
        exec(command, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
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
