import type { ActionHandler } from "@Core/ActionHandler";
import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { SearchResultItemAction } from "@common/Core";
import { basename } from "path";

/**
 * Action handler for launching a `.desktop` file.
 */
export class GtkLaunchActionHandler implements ActionHandler {
    public readonly id = "GtkLaunch";

    public constructor(private readonly commandlineUtility: CommandlineUtility) {}

    /**
     * Launches the given file by executing `gtk-launch`.
     * Expects the given action's argument to be a valid file WITHIN "/usr/share/applications", e.g.: `"/usr/share/applications/firefox.desktop"`
     * Throws an error if the file could not be launched.
     */
    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        await this.commandlineUtility.executeCommand(`gtk-launch ${basename(action.argument)}`, true);
    }
}
