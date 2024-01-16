import type { PowershellUtility } from "@Core/PowershellUtility";
import type { SearchResultItemAction } from "@common/Core";
import type { ActionHandler } from "../Contract/ActionHandler";

export class PowershellActionHandler implements ActionHandler {
    public readonly id = "Powershell";

    public constructor(private readonly powershellUtility: PowershellUtility) {}

    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        await this.powershellUtility.executeCommand(`powershell -Command "& {${action.argument}}"`);
    }
}
