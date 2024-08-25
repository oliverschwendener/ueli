import type { ActionHandler } from "@Core/ActionHandler";
import type { PowershellUtility } from "@Core/PowershellUtility";
import type { SearchResultItemAction } from "@common/Core";

/**
 * Action handler for executing a Powershell command.
 */
export class PowershellActionHandler implements ActionHandler {
    public readonly id = "Powershell";

    public constructor(private readonly powershellUtility: PowershellUtility) {}

    /**
     * Executes the given Powershell command and waits until it finishes.
     * Expects the given action's argument to be a valid Powershell command, e.g.: `"Get-Process"`.
     * Does not support scripts, only single-line commands.
     */
    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        await this.powershellUtility.executeCommand(`powershell -Command "& {${action.argument}}"`);
    }
}
