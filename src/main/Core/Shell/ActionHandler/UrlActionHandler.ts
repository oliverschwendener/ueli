import type { ActionHandler } from "@Core/ActionHandler";
import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { SettingsManager } from "@Core/SettingsManager";
import type { SearchResultItemAction } from "@common/Core";
import type { Shell } from "electron";

/**
 * Action handler for opening a URL.
 */
export class UrlActionHandler implements ActionHandler {
    public readonly id = "Url";

    public constructor(
        private readonly settingsManager: SettingsManager,
        private readonly shell: Shell,
        private readonly commandlineUtility: CommandlineUtility,
    ) {}

    /**
     * Opens the given URL with the system's default web browser. Expects the given action's argument to be a valid URL,
     * e.g. `"https://example.com"`.
     */
    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        const useDefaultWebBrowser = this.settingsManager.getValue<boolean>(
            "general.browser.useDefaultWebBrowser",
            true,
        );

        const template = this.settingsManager.getValue<string>("general.browser.customWebBrowserTemplate", "");

        if (useDefaultWebBrowser || !template) {
            await this.shell.openExternal(action.argument);
        } else {
            this.commandlineUtility
                .executeCommand(template.replace("{{url}}", action.argument))
                .then(() => null)
                .catch(() => {
                    // not sure what should happen here...
                });
        }
    }
}
