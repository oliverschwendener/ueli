import type { ActionHandler } from "@Core/ActionHandler";
import type { SearchResultItemAction } from "@common/Core";
import type { Shell } from "electron";

/**
 * Action handler for showing an item in the file browser.
 */
export class ShowItemInFileExplorerActionHandler implements ActionHandler {
    public readonly id = "ShowItemInFileExplorer";

    public constructor(private readonly shell: Shell) {}

    /**
     * Shows the given item in the system's default file browser.
     * Expects the given action's argument to be a valid file path, e.g.: `"C:\example.txt"` on Windows or
     * `"/System/Users/{UserName}/example.txt"` on macOS and Linux.
     */
    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        this.shell.showItemInFolder(action.argument);
    }
}
