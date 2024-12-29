import type { ActionHandler } from "@Core/ActionHandler";
import type { BrowserWindowNotifier } from "@Core/BrowserWindowNotifier";
import type { NavigateToArgument, SearchResultItemAction } from "@common/Core";

/**
 * Action handler for navigating to a specific path in the renderer process.
 */
export class NavigateToActionHandler implements ActionHandler {
    public id = "navigateTo";

    public constructor(private readonly browserWindowNotifier: BrowserWindowNotifier) {}

    /**
     * Navigates to the given path in the renderer process.
     * Expects the given action's argument to be a valid path, e.g.: "/my/path".
     */
    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        const { browserWindowId, pathname }: NavigateToArgument = JSON.parse(action.argument);

        this.browserWindowNotifier.notify({
            browserWindowId,
            channel: "navigateTo",
            data: { pathname },
        });
    }
}
