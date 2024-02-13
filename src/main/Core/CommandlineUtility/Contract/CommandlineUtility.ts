export interface CommandlineUtility {
    executeCommandWithOutput(command: string, ignoreStdErr?: boolean): Promise<string>;
    executeCommand(command: string): Promise<void>;
}
