import type { ActionHandler } from "@Core/ActionHandler";
import type { SearchResultItemAction } from "@common/Core";
import type { Shell } from "electron";

export class OpenFilePathActionHandler implements ActionHandler {
    public readonly id = "OpenFilePath";

    public constructor(private readonly shell: Shell) {}

    public invokeAction(action: SearchResultItemAction): Promise<void> {
        return this.openFilePath(action.argument);
    }

    private async openFilePath(filePath: string): Promise<void> {
        const errorMessage = await this.shell.openPath(filePath);

        if (errorMessage) {
            throw new Error(errorMessage);
        }
    }
}
