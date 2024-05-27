import type { ActionHandler } from "@Core/ActionHandler";
import type { PowershellUtility } from "@Core/PowershellUtility";
import type { SearchResultItemAction } from "@common/Core";

export class WindowsControlPanelActionHandler implements ActionHandler {
    public readonly id = "WindowsControlPanel";

    public constructor(private readonly powershellUtility: PowershellUtility) {}

    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        await this.powershellUtility.executeCommand(`Show-ControlPanelItem -Name '${action.argument}'`);
    }
}
