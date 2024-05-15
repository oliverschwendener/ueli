import type { AppleScriptUtility } from "@Core/AppleScriptUtility";
import type { TerminalLauncher } from "./TerminalLauncher";

export class MacOsTerminalLauncher implements TerminalLauncher {
    public readonly terminalId = "Terminal";

    public constructor(private readonly appleScriptUtility: AppleScriptUtility) {}

    public async launchWithCommand(command: string): Promise<void> {
        await this.appleScriptUtility.executeAppleScript(`tell application "Terminal"
                                                            if not (exists window 1) then reopen
                                                                activate
                                                            do script "${command}" in window 1
                                                        end tell`);
    }
}
