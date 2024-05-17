import type { ActionHandler } from "@Core/ActionHandler";
import type { SearchResultItemAction } from "@common/Core";
import type { ActionArgument } from "./ActionArgument";
import type { TerminalLauncher } from "./TerminalLauncher";

export class LaunchTerminalActionHandler implements ActionHandler {
    public readonly id = "LaunchTerminalActionHandler";

    public constructor(private readonly terminalLaunchers: TerminalLauncher[]) {}

    public async invokeAction(action: SearchResultItemAction) {
        const { command, terminalId }: ActionArgument = JSON.parse(action.argument);

        const terminalLauncher: TerminalLauncher | undefined = this.terminalLaunchers.find(
            (launcher) => launcher.terminalId === terminalId,
        );

        if (!terminalLauncher) {
            throw new Error(`Unable to launch terminal with id  ${terminalId}. Reason: no launcher found`);
        }

        await terminalLauncher.launchWithCommand(command);
    }
}
