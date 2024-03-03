import type { ActionHandler } from "@Core/ActionHandler";
import { CommandlineUtility } from "@Core/CommandlineUtility";
import type { SearchResultItemAction } from "@common/Core";
import type { Shell } from "electron";
import { basename, extname } from "path";

/**
 * Action handler for opening a file path.
 */
export class OpenFilePathActionHandler implements ActionHandler {
    public readonly id = "OpenFilePath";

    public constructor(
        private readonly shell: Shell,
        private readonly commandlineUtility: CommandlineUtility,
    ) {}

    /**
     * Opens the given file path with the system's default application.
     * Expects the given action's argument to be a valid file path, e.g.: `"C:\example.txt"` on Windows or
     * `"/System/Users/{UserName}/example.txt"` on macOS and Linux.
     * Throws an error if the file path could not be opened.
     */
    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        const errorMessage = await this.shell.openPath(action.argument);

        if (errorMessage) {
            throw new Error(errorMessage);
        }
    }
}
