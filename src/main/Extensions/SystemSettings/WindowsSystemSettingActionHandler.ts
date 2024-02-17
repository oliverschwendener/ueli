import type { ActionHandler } from "@Core/ActionHandler";
import type { PowershellUtility } from "@Core/PowershellUtility";
import type { SearchResultItemAction } from "@common/Core";

export class WindowsSystemSettingActionHandler implements ActionHandler {
    public readonly id = "WindowsSystemSetting";

    public constructor(private readonly powershellUtility: PowershellUtility) {}

    public async invokeAction({ argument }: SearchResultItemAction): Promise<void> {
        await this.powershellUtility.executeCommand(`Start-Process "${argument}"`);
    }
}
