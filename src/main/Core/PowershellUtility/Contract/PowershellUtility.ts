/**
 * Offers methods to execute PowerShell commands and scripts.
 */
export interface PowershellUtility {
    /**
     * Executes a PowerShell command.
     * @param command The command to execute, e.g. `Get-Process`.
     * @returns The output of the powershell command.
     */
    executeCommand(command: string): Promise<string>;

    /**
     * Executes a PowerShell script. The script can also be multi-line and include functions.
     * @param script The script to execute, e.g.:
     * ```powershell
     * Write-Host "Hello, World!"
     * Write-Host "This is a PowerShell script."
     * Write-Host "It is executed by the PowerShellUtility."
     * ```
     * @returns The output of the powershell script.
     */
    executeScript(script: string): Promise<string>;
}
