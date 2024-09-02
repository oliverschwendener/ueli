import type { SearchResultItemAction } from "@common/Core";
import type { ActionHandler } from "@Core/ActionHandler";
import type { CommandlineUtility } from "../Contract";

/**
 * Action handler for executing a CLI command.
 */
export class CommandlineActionHandler implements ActionHandler {
    public readonly id = "Commandline";

    public constructor(private readonly commandlineUtility: CommandlineUtility) {}

    /**
     * Executes the given CLI command and waits until it finishes.
     * The output of the command is ignored.
     * Expects the given action's argument to be a valid CLI command, e.g.: `"ls -la"`.
     */
    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        await this.commandlineUtility.executeCommand(action.argument);
    }
}
