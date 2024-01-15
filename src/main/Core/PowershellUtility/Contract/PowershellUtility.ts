export interface PowershellUtility {
    executeCommand(command: string): Promise<string>;
    executeScript(script: string): Promise<string>;
}
