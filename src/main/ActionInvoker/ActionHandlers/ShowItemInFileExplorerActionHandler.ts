import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import type { Shell } from "electron";
import type { ActionHandler } from "./ActionHandler";

export class ShowItemInFileExplorerActionHandler implements ActionHandler {
    public constructor(private readonly shell: Shell) {}

    public async invoke(action: SearchResultItemAction): Promise<void> {
        return this.shell.showItemInFolder(action.argument);
    }
}
