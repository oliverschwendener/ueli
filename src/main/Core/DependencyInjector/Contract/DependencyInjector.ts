import type { ActionHandler } from "../../ActionHandler";
import type { DependencyName } from "../DependencyName";

export interface DependencyInjector {
    registerActionHandler(actionHandler: ActionHandler): void;
    getActionHandler(actionHandlerId: string): ActionHandler;

    registerInstance<T>(name: DependencyName, instance: T): void;
    getInstance<T>(name: DependencyName): T;
}
