import type { ActionHandler } from "@Core/ActionHandler";
import type { TerminalRegistry } from "@Core/Terminal";
import type { SearchResultItemAction } from "@common/Core";
import type { ActionArgument } from "./ActionArgument";

export class LaunchTerminalActionHandler implements ActionHandler {
    public readonly id = "LaunchTerminalActionHandler";

    public constructor(private readonly terminalRegistry: TerminalRegistry) {}

    public async invokeAction(action: SearchResultItemAction) {
        const { command, terminalId }: ActionArgument = JSON.parse(action.argument);

        await this.terminalRegistry.getById(terminalId).launchWithCommand(command);
    }
}
