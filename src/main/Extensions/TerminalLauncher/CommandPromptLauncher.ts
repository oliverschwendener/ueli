import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { TerminalLauncher } from "./TerminalLauncher";

export class CommandPrompLauncher implements TerminalLauncher {
    public readonly terminalId = "Command Prompt";

    public constructor(private readonly commandlineUtility: CommandlineUtility) {}

    public async launchWithCommand(command: string): Promise<void> {
        await this.commandlineUtility.executeCommand(`start cmd.exe /k "${command}"`);
    }
}
