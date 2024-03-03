import type { ActionHandler } from "@Core/ActionHandler";
import { CommandlineUtility } from "@Core/CommandlineUtility";
import type { SearchResultItemAction } from "@common/Core";
import type { Shell } from "electron";
import { basename, extname } from "path";

export class OpenFilePathActionHandler implements ActionHandler {
    public readonly id = "OpenFilePath";

    public constructor(
        private readonly shell: Shell,
        private readonly commandlineUtility: CommandlineUtility,
    ) {}

    public invokeAction(action: SearchResultItemAction): Promise<void> {
        return this.openFilePath(action.argument);
    }

    private async openFilePath(filePath: string): Promise<void> {
        // Linux has own way of opening files
        if (extname(filePath) === ".desktop") {
            // Don't await otherwise command hangs until app closes
            this.commandlineUtility.executeCommand(`gtk-launch ${basename(filePath)}`);
        } else {
            const errorMessage = await this.shell.openPath(filePath);
            if (errorMessage) {
                throw new Error(`File: ${filePath} | Error: ${errorMessage}`);
            }
        }
    }
}
