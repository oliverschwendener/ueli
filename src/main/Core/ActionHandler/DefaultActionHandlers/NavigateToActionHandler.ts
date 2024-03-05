import type { EventEmitter } from "@Core/EventEmitter";
import type { SearchResultItemAction } from "@common/Core";
import type { ActionHandler } from "../Contract";

/**
 * Action handler for navigating to a specific path in the renderer process.
 */
export class NavigateToActionHandler implements ActionHandler {
    public id = "navigateTo";

    public constructor(private readonly eventEmitter: EventEmitter) {}

    /**
     * Navigates to the given path in the renderer process.
     * Expects the given action's argument to be a valid path, e.g.: "/settings".
     */
    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        this.eventEmitter.emitEvent("navigateTo", { pathname: action.argument });
    }
}
