import { executeCommand } from "./command-executor";
import { shell } from "electron";
import { extname, basename } from "path";

export function executeFilePathWindows(filePath: string, privileged: boolean): Promise<void> {
    return privileged ? executeFilePathWindowsAsPrivileged(filePath) : openFile(filePath);
}

export function executeFilePathMacOs(filePath: string, privileged: boolean): Promise<void> {
    return privileged ? executeFilePathMacOsAsPrivileged(filePath) : openFile(filePath);
}

export function executeFilePathLinux(filePath: string, privileged: boolean): Promise<void> {
    return privileged ? executeFilePathLinuxAsPrivileged(filePath) : openFile(filePath);
}

function openFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (extname(filePath) == ".desktop") {
            return openLinuxDesktopFile(filePath);
        } else {
            shell
                .openPath(filePath)
                .then((error) => (error ? reject(error) : resolve()))
                .catch(() => reject(`Failed to open: ${filePath}`));
        }
    });
}

function openLinuxDesktopFile(filePath: string): Promise<void> {
    // Weirdly it's available on KDE based distros as well.
    // I guess they didn't invent their own way to run .desktop files.
    return executeCommand(`gtk-launch ${basename(filePath)}`);
}

function executeFilePathWindowsAsPrivileged(filePath: string): Promise<void> {
    return executeCommand(`powershell -Command "& {Start-Process -Verb runas '${filePath}'}"`);
}

function executeFilePathMacOsAsPrivileged(filePath: string): Promise<void> {
    return executeCommand(`osascript -e 'do shell script "open \\"${filePath}\\"" with administrator privileges'`);
}

function executeFilePathLinuxAsPrivileged(filePath: string): Promise<void> {
    return executeCommand(`sudo /bin/bash \\"${filePath}\\"`);
}
