import type { OperatingSystem } from "@common/Core";
import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { PowershellUtility } from "@Core/PowershellUtility";

export class EmptyTrash {
    public constructor(
        private readonly commandlineUtility: CommandlineUtility,
        private readonly powershellUtility: PowershellUtility,
        private readonly operatingSystem: OperatingSystem,
    ) {}

    public async emptyTrash(): Promise<void> {
        const commands: Record<OperatingSystem, () => Promise<void>> = {
            Linux: async () => {
                await this.commandlineUtility.executeCommand("rm -rf ~/.local/share/Trash/*");
            },
            macOS: async () => {
                await this.commandlineUtility.executeCommand(
                    "osascript -e 'tell application \"Finder\" to activate' -e 'tell application \"Finder\" to if ((count of items in trash) > 0) then empty trash'",
                );
            },
            Windows: async () => {
                await this.powershellUtility.executeCommand("Clear-RecycleBin -Force");
            },
        };

        await commands[this.operatingSystem]();
    }
}
