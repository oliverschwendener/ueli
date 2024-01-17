import type { ActionHandler, ActionHandlerRegistry as ActionHandlerRegistryInterface } from "./Contract";

export class ActionHandlerRegistry implements ActionHandlerRegistryInterface {
    private readonly actionHandlers: Record<string, ActionHandler> = {};

    public register(actionHandler: ActionHandler): void {
        if (this.actionHandlers[actionHandler.id]) {
            throw new Error(`Action handler with id "${actionHandler.id}" is already registered`);
        }

        this.actionHandlers[actionHandler.id] = actionHandler;
    }

    public getById(actionHandlerId: string) {
        if (!this.actionHandlers[actionHandlerId]) {
            throw new Error(`Action handler with id "${actionHandlerId}" can't be found`);
        }

        return this.actionHandlers[actionHandlerId];
    }

    public getAll(): ActionHandler[] {
        return Object.values(this.actionHandlers);
    }
}
