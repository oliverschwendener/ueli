import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import type { Shell } from "electron";
import type { ActionHandler } from "../Contract/ActionHandler";

export class ShowItemInFileExplorerActionHandler implements ActionHandler {
    public readonly id = "ShowItemInFileExplorer";

    public constructor(private readonly shell: Shell) {}

    public async invoke(action: SearchResultItemAction): Promise<void> {
        return this.shell.showItemInFolder(action.argument);
    }
}
