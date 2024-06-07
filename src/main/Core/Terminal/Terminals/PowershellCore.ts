import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { Terminal } from "../Contract";

export class PowershellCore implements Terminal {
    public readonly terminalId = "Powershell Core";

    public constructor(private readonly commandlineUtility: CommandlineUtility) {}

    public getTerminalName(): string {
        return "Powershell Core";
    }

    public getAssetFileName(): string {
        return "powershell-core.svg";
    }

    public async launchWithCommand(command: string): Promise<void> {
        await this.commandlineUtility.executeCommand(`start pwsh -NoExit -Command "&${command}"`);
    }
}
