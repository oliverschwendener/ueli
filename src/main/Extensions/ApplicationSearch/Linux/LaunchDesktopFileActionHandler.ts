import type { ActionHandler } from "@Core/ActionHandler";
import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { SearchResultItemAction } from "@common/Core";
import type { BrowserWindowRegistry } from "../../../Core";

/**
 * Action handler for launching a `.desktop` file.
 */
export class LaunchDesktopFileActionHandler implements ActionHandler {
    public readonly id = "LaunchDesktopFile";

    public constructor(
        private readonly commandlineUtility: CommandlineUtility,
        private readonly browserRegistry: BrowserWindowRegistry,
    ) {}

    /**
     * Launches the given `.desktop` file with the desktop environment's respective command.
     * Expects the given action's argument to be a valid desktop file
     * Throws an error if the file could not be launched or desktop environment isn't supported.
     */
    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        const searchWindow = this.browserRegistry.getById("search");

        searchWindow?.hide();
        try {
            await this.commandlineUtility.executeCommand(`gio launch ${action.argument}`, { ignoreStdErr: true });
        } catch (err) {
            searchWindow?.show();
            throw err;
        }
    }
}
