import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { TerminalLauncher } from "./TerminalLauncher";

export class PowershellTerminalLauncher implements TerminalLauncher {
    public readonly terminalId = "Powershell";

    public constructor(private readonly commandlineUtility: CommandlineUtility) {}

    public async launchWithCommand(command: string): Promise<void> {
        await this.commandlineUtility.executeCommand(`start powershell -NoExit -Command "&${command}"`);
    }
}
