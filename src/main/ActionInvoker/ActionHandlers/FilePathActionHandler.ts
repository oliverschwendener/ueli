import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import type { Shell } from "electron";
import type { ActionHandler } from "./ActionHandler";

export class FilePathActionHandler implements ActionHandler {
    public constructor(private readonly shell: Shell) {}

    public invoke(action: SearchResultItemAction): Promise<void> {
        return this.openFilePath(action.argument);
    }

    private async openFilePath(filePath: string): Promise<void> {
        const errorMessage = await this.shell.openPath(filePath);

        if (errorMessage) {
            throw new Error(errorMessage);
        }
    }
}
