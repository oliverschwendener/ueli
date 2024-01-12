import type { EventEmitter } from "@Core/EventEmitter";
import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import type { ActionHandler } from "../Contract";

export class NavigateToActionHandler implements ActionHandler {
    public id = "navigateTo";

    public constructor(private readonly eventEmitter: EventEmitter) {}

    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        this.eventEmitter.emitEvent("navigateTo", { pathname: action.argument });
    }
}
