import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { Terminal } from "./Terminal";

export class Wsl implements Terminal {
    public readonly terminalId = "WSL";

    public constructor(private readonly commandlineUtility: CommandlineUtility) {}

    public getTerminalName(): string {
        return "WSL";
    }

    public getAssetFileName(): string {
        return "wsl.png";
    }

    public async launchWithCommand(command: string): Promise<void> {
        await this.commandlineUtility.executeCommand(`start wsl.exe sh -c "${command}; exec $SHELL"`);
    }
}
