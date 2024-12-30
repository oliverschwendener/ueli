import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { SearchResultItemAction } from "@common/Core";
import { ActionHandlerRegistry } from "./ActionHandlerRegistry";

export class ActionHandlerModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const eventEmitter = moduleRegistry.get("EventEmitter");
        const ipcMain = moduleRegistry.get("IpcMain");
        const logger = moduleRegistry.get("Logger");

        const actionHandlerRegistry = new ActionHandlerRegistry();

        moduleRegistry.register("ActionHandlerRegistry", actionHandlerRegistry);

        ipcMain.handle("invokeAction", async (_, { action }: { action: SearchResultItemAction }) => {
            try {
                await actionHandlerRegistry.getById(action.handlerId).invokeAction(action);
                eventEmitter.emitEvent("actionInvoked", { action });
            } catch (error) {
                const errorMessage = `Error while invoking action: ${error}`;
                logger.error(errorMessage);
                return Promise.reject(errorMessage);
            }
        });
    }
}
