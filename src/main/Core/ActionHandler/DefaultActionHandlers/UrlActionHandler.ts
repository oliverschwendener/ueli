import type { ActionHandler } from "@Core/ActionHandler";
import type { SearchResultItemAction } from "@common/Core";
import type { Shell } from "electron";

export class UrlActionHandler implements ActionHandler {
    public readonly id = "Url";

    public constructor(private readonly shell: Shell) {}

    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        await this.shell.openExternal(action.argument);
    }
}
