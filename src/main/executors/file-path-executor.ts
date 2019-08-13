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
    return executeCommand(`osascript -e 'do shell script "open \\"${filePath}\\"" with administrator privileges'`);
}
