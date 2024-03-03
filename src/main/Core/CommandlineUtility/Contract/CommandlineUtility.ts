export interface CommandlineUtility {
    executeCommandWithOutput(command: string, ignoreStdErr?: boolean, ignoreErr?: boolean): Promise<string>;
    executeCommand(command: string): Promise<void>;
}
