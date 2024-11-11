/**
 * Offers methods to execute command line commands.
 */
export interface CommandlineUtility {
    /**
     * Executes a command and returns the output.
     * @param command The command to execute, e.g. `"echo Hello World"`.
     * @param options.ignoreErr If `true`, the error is ignored and not thrown as an error.
     * @param options.ignoreStdErr If `true`, the standard error output is ignored and not thrown as an error.
     * @param options.maxBuffer The maximum buffer size in bytes allowed for the standard output and standard error streams.
     * @returns A promise that resolves with the output of the command.
     */
    executeCommand(
        command: string,
        options?: {
            ignoreStdErr?: boolean;
            ignoreErr?: boolean;
            maxBuffer?: number;
        },
    ): Promise<string>;
}
