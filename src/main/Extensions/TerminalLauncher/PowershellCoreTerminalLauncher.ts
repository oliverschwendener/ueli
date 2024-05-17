import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { TerminalLauncher } from "./TerminalLauncher";

export class PowershellCoreTerminalLauncher implements TerminalLauncher {
    public readonly terminalId = "Powershell Core";

    public constructor(private readonly commandlineUtility: CommandlineUtility) {}

    public async launchWithCommand(command: string): Promise<void> {
        await this.commandlineUtility.executeCommand(`start pwsh -NoExit -Command "&${command}"`);
    }
}
