import type { ActionHandler } from "@Core/ActionHandler";
import type { AppleScriptUtility } from "@Core/AppleScriptUtility";
import type { SearchResultItemAction } from "@common/Core";

export class MacOsSystemCommandActionHandler implements ActionHandler {
    public readonly id = "MacOsSystemCommandActionHandler";

    public constructor(private readonly appleScriptUtility: AppleScriptUtility) {}

    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        await this.appleScriptUtility.executeAppleScript(action.argument);
    }
}
