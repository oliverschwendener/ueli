import type { ActionHandler } from "../ActionHandler";
import type { DependencyInjector as DependencyInjectorInterface } from "./Contract";
import type { DependencyName } from "./DependencyName";

export class DependencyInjector implements DependencyInjectorInterface {
    private dependencies: Record<DependencyName | string, unknown> = {};
    private actionHandlers: Record<string, ActionHandler> = {};

    public getActionHandler(actionHandlerId: string): ActionHandler {
        const candidate = this.actionHandlers[actionHandlerId];

        if (!candidate) {
            throw new Error(`Unable to find action handler with id "${actionHandlerId}"`);
        }

        return candidate;
    }

    public registerActionHandler(actionHandler: ActionHandler): void {
        if (this.actionHandlers[actionHandler.id]) {
            throw new Error(`Action handler with id "${actionHandler.id}" is already registered`);
        }

        this.actionHandlers[actionHandler.id] = actionHandler;
    }

    public registerInstance<T>(name: DependencyName, instance: T): void {
        this.dependencies[name] = instance;
    }

    public getInstance<T>(name: DependencyName): T {
        const instance = this.dependencies[name] as T;

        if (!instance) {
            throw new Error(`Instance with name "${name}" not found`);
        }

        return instance;
    }
}
