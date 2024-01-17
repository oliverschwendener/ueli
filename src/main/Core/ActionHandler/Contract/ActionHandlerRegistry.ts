import type { ActionHandler } from "./ActionHandler";

export interface ActionHandlerRegistry {
    register(actionHandler: ActionHandler): void;
    getById(actionHandlerId: string): ActionHandler;
    getAll(): ActionHandler[];
}
