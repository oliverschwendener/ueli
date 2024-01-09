export interface CommandlineUtility {
    executeCommandWithOutput(command: string): Promise<string>;
    executeCommand(command: string): Promise<void>;
}
