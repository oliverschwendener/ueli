import { executeCommand } from "./command-executor";

export function executeUrlWindows(url: string): Promise<void> {
    return executeCommand(`start explorer "${url}"`);
}

export function executeUrlMacOs(url: string): Promise<void> {
    return executeCommand(`open "${url}"`);
}
