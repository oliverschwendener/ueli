import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { AppleScriptUtility as AppleScriptUtilityInterface } from "./Contract";

export class AppleScriptUtility implements AppleScriptUtilityInterface {
    public constructor(private readonly commandlineUtility: CommandlineUtility) {}

    public async executeAppleScript(appleScript: string): Promise<string> {
        return await this.commandlineUtility.executeCommand(`osascript -e '${appleScript}'`);
    }
}
