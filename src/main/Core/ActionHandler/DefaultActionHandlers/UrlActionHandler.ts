import type { ActionHandler } from "@Core/ActionHandler";
import type { SearchResultItemAction } from "@common/Core";
import type { Shell } from "electron";

/**
 * Action handler for opening a URL.
 */
export class UrlActionHandler implements ActionHandler {
    public readonly id = "Url";

    public constructor(private readonly shell: Shell) {}

    /**
     * Opens the given URL with the system's default web browser. Expects the given action's argument to be a valid URL,
     * e.g. `"https://example.com"`.
     */
    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        await this.shell.openExternal(action.argument);
    }
}
