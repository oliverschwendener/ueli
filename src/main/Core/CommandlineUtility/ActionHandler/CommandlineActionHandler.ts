import type { SearchResultItemAction } from "@common/Core";
import type { ActionHandler } from "@Core/ActionHandler";
import type { Logger } from "@Core/Logger";
import type { CommandlineUtility } from "../Contract";

/**
 * Action handler for executing a CLI command.
 */
export class CommandlineActionHandler implements ActionHandler {
    public readonly id = "Commandline";

    public constructor(
        private readonly commandlineUtility: CommandlineUtility,
        private readonly logger: Logger,
    ) {}

    /**
     * Executes the given CLI command and waits until it finishes.
     * The output of the command is ignored.
     * Expects the given action's argument to be a valid CLI command, e.g.: `"ls -la"`.
     */
    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        try {
            const output = await this.commandlineUtility.executeCommand(action.argument);
            if (output.trim() !== "") {
                this.logger.info(output);
            }
        } catch (error) {
            this.logger.error("CommandLineActionHandler: " + error);
        }
    }
}
