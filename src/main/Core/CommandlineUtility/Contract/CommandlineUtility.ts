/**
 * Offers methods to execute command line commands.
 */
export interface CommandlineUtility {
    /**
     * Executes a command and returns the output.
     * @param command The command to execute, e.g. `"echo Hello World"`.
     * @param ignoreStdErr If `true`, the standard error output is ignored and not thrown as an error.
     * @param ignoreErr If `true`, the error is ignored and not thrown as an error.
     * @returns A promise that resolves with the output of the command.
     */
    executeCommand(command: string, ignoreStdErr?: boolean, ignoreErr?: boolean): Promise<string>;
}
