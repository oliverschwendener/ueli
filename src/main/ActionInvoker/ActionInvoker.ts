import type { EventEmitter } from "@common/EventEmitter";
import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import type { ActionHandler } from "./ActionHandlers";

export class ActionInvoker {
    public constructor(
        private readonly actionHandlers: Record<string, ActionHandler>,
        private readonly eventEmitter: EventEmitter,
    ) {}

    public async invoke(action: SearchResultItemAction): Promise<void> {
        const { handlerId } = action;

        const actionHandler = this.actionHandlers[handlerId];

        if (!actionHandler) {
            throw new Error(`Unable to find action handler by id: '${handlerId}'`);
        }

        await actionHandler.invoke(action);

        this.eventEmitter.emitEvent("actionInvokationSucceeded", { action });
    }
}
