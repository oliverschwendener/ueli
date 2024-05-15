import type { AppleScriptUtility } from "@Core/AppleScriptUtility";
import type { TerminalLauncher } from "./TerminalLauncher";

export class ItermLauncher implements TerminalLauncher {
    public readonly terminalId = "iTerm";

    public constructor(private readonly appleScriptUtility: AppleScriptUtility) {}

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
