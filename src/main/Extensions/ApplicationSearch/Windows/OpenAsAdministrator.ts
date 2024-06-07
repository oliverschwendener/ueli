import type { ActionHandler } from "@Core/ActionHandler";
import type { PowershellUtility } from "@Core/PowershellUtility";
import type { SearchResultItemAction } from "@common/Core";

export class OpenAsAdministrator implements ActionHandler {
    public readonly id = "WindowsOpenAsAdministrator";

    public constructor(private readonly powershellUtility: PowershellUtility) {}

    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        await this.powershellUtility.executeCommand(`Start-Process -Verb runas '${action.argument}'`);
    }
}
