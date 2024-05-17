import type { AppleScriptUtility } from "@Core/AppleScriptUtility";
import type { Terminal } from "./Terminal";

export class Iterm implements Terminal {
    public readonly terminalId = "iTerm";

    public constructor(private readonly appleScriptUtility: AppleScriptUtility) {}

    public getTerminalName(): string {
        return "iTerm";
    }

    public getAssetFileName(): string {
        return "iterm.png";
    }

    public async launchWithCommand(command: string): Promise<void> {
        await this.appleScriptUtility.executeAppleScript(`tell application "iTerm"
                                                            if not (exists window 1) then
                                                                reopen
                                                            else
                                                                tell current window
                                                                    create tab with default profile
                                                                end tell
                                                            end if

                                                            activate

                                                            tell first session of current tab of current window
                                                                write text "${command}"
                                                            end tell
                                                        end tell`);
    }
}
