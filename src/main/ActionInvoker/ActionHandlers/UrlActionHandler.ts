import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import type { Shell } from "electron";
import type { ActionHandler } from "./ActionHandler";

export class UrlExecutionService implements ActionHandler {
    public constructor(private readonly shell: Shell) {}

    public invoke(action: SearchResultItemAction): Promise<void> {
        return this.shell.openExternal(action.argument);
    }
}
