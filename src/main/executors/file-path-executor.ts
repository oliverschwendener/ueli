import { executeCommand } from "./command-executor";
import { shell } from "electron";

export function executeFilePathWindows(filePath: string, privileged: boolean): Promise<void> {
    return privileged ? executeFilePathWindowsAsPrivileged(filePath) : openFile(filePath);
}

export function executeFilePathMacOs(filePath: string, privileged: boolean): Promise<void> {
    return privileged ? executeFilePathMacOsAsPrivileged(filePath) : openFile(filePath);
}

function openFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const result = shell.openPath(filePath);
        if (result) {
            resolve();
        } else {
            reject(`Failed to open: ${filePath}`);
        }
    });
}

function executeFilePathWindowsAsPrivileged(filePath: string): Promise<void> {
    return executeCommand(`powershell -Command "& {Start-Process -Verb runas '${filePath}'}"`);
}

function executeFilePathMacOsAsPrivileged(filePath: string): Promise<void> {
    return executeCommand(`osascript -e 'do shell script "open \\"${filePath}\\"" with administrator privileges'`);
}
