import { executeCommand } from "./command-executor";

export function executeFilePathLocationWindows(filePath: string): Promise<void> {
    return executeCommand(`start explorer.exe /select,"${filePath}"`);
}

export function executeFilePathLocationMacOs(filePath: string): Promise<void> {
    return executeCommand(`open -R "${filePath}"`);
}
