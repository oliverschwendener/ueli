/**
 * Offers methods to execute PowerShell commands and scripts.
 */
export interface PowershellUtility {
    /**
     * Executes a PowerShell command.
     * @param command The command to execute, e.g. `Get-Process`.
     * @param options.maxBuffer The maximum buffer size in bytes allowed for the standard output and standard error streams.
     * @returns The output of the powershell command.
     */
    executeCommand(command: string, options?: { maxBuffer?: number }): Promise<string>;

    /**
     * Executes a PowerShell script. The script can also be multi-line and include functions.
     * @param script The script to execute, e.g.:
     * ```powershell
     * Write-Host "Hello, World!"
     * Write-Host "This is a PowerShell script."
     * Write-Host "It is executed by the PowerShellUtility."
     * ```
     * @param options.maxBuffer The maximum buffer size in bytes allowed for the standard output and standard error streams.
     * @returns The output of the powershell script.
     */
    executeScript(script: string, options?: { maxBuffer?: number }): Promise<string>;
}
