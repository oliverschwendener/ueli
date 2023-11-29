import type { ActionHandler } from "../../ActionHandler";
import type { Extension } from "../../Extension";
import type { DependencyName } from "../DependencyName";

export interface DependencyInjector {
    registerExtension(extension: Extension): void;
    getAllExtensions(): Extension[];

    registerActionHandler(actionHandler: ActionHandler): void;
    getAllActionHandlers(): ActionHandler[];

    registerInstance<T>(name: DependencyName, instance: T): void;
    getInstance<T>(name: DependencyName): T;
}
