import type { AppleScriptUtility } from "@Core/AppleScriptUtility";
import type { Terminal } from "../Contract";

export class MacOsTerminal implements Terminal {
    public readonly terminalId = "Terminal";

    public readonly isEnabledByDefault = true;

    public constructor(private readonly appleScriptUtility: AppleScriptUtility) {}

    public getTerminalName(): string {
        return "Terminal";
    }

    public getAssetFileName(): string {
        return "terminal.png";
    }

    public async launchWithCommand(command: string): Promise<void> {
        await this.appleScriptUtility.executeAppleScript(`tell application "Terminal"
                                                            if not (exists window 1) then reopen
                                                                activate
                                                            do script "${command}" in window 1
                                                        end tell`);
    }
}
