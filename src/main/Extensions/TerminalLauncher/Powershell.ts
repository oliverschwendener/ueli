import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { Terminal } from "./Terminal";

export class Powershell implements Terminal {
    public readonly terminalId = "Powershell";

    public constructor(private readonly commandlineUtility: CommandlineUtility) {}

    public getTerminalName(): string {
        return "Powershell";
    }

    public getAssetFileName(): string {
        return "powershell.png";
    }

    public async launchWithCommand(command: string): Promise<void> {
        await this.commandlineUtility.executeCommand(`start powershell -NoExit -Command "&${command}"`);
    }
}
