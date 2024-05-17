import type { ActionHandler } from "@Core/ActionHandler";
import type { SearchResultItemAction } from "@common/Core";
import type { ActionArgument } from "./ActionArgument";
import type { Terminal } from "./Terminal";

export class LaunchTerminalActionHandler implements ActionHandler {
    public readonly id = "LaunchTerminalActionHandler";

    public constructor(private readonly terminals: Terminal[]) {}

    public async invokeAction(action: SearchResultItemAction) {
        const { command, terminalId }: ActionArgument = JSON.parse(action.argument);

        const terminalLauncher: Terminal | undefined = this.terminals.find(
            (launcher) => launcher.terminalId === terminalId,
        );

        if (!terminalLauncher) {
            throw new Error(`Unable to launch terminal with id  ${terminalId}. Reason: terminal not found`);
        }

        await terminalLauncher.launchWithCommand(command);
    }
}
