import type { ActionHandler } from "@Core/ActionHandler";
import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { SearchResultItemAction } from "@common/Core";

export class MacOsSystemCommandActionHandler implements ActionHandler {
    public readonly id = "MacOsSystemCommandActionHandler";

    public constructor(private readonly commandlineUtility: CommandlineUtility) {}

    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        await this.commandlineUtility.executeCommand(action.argument);
    }
}
