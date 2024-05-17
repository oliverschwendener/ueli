import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { Terminal } from "./Terminal";

export class CommandPromp implements Terminal {
    public readonly terminalId = "Command Prompt";

    public readonly isEnabledByDefault = true;

    public constructor(private readonly commandlineUtility: CommandlineUtility) {}

    public getTerminalName(): string {
        return "Command Prompt";
    }

    public getAssetFileName(): string {
        return "command-prompt.png";
    }

    public async launchWithCommand(command: string): Promise<void> {
        await this.commandlineUtility.executeCommand(`start cmd.exe /k "${command}"`);
    }
}
