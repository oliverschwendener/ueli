import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { TerminalLauncher } from "./TerminalLauncher";

export class WslTerminalLauncher implements TerminalLauncher {
    public readonly terminalId = "WSL";

    public constructor(private readonly commandlineUtility: CommandlineUtility) {}

    public async launchWithCommand(command: string): Promise<void> {
        await this.commandlineUtility.executeCommand(`start wsl.exe sh -c "${command}; exec $SHELL"`);
    }
}
