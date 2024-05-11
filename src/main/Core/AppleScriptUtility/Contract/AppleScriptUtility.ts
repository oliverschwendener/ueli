/**
 * Offers methods to execute AppleScript commands.
 */
export interface AppleScriptUtility {
    /**
     * Executes the given AppleScript command and returns the output.
     * @param appleScript The AppleScript command to execute, e.g. `tell application "Finder" to activate`.
     * @returns A promise that resolves with the output of the executed AppleScript command.
     */
    executeAppleScript(appleScript: string): Promise<string>;
}
