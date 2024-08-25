import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { SearchResultItemAction } from "@common/Core";
import { ActionHandlerRegistry } from "./ActionHandlerRegistry";

export class ActionHandlerModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const eventEmitter = dependencyRegistry.get("EventEmitter");
        const ipcMain = dependencyRegistry.get("IpcMain");

        const actionHandlerRegistry = new ActionHandlerRegistry();

        dependencyRegistry.register("ActionHandlerRegistry", actionHandlerRegistry);

        ipcMain.handle("invokeAction", async (_, { action }: { action: SearchResultItemAction }) => {
            await actionHandlerRegistry.getById(action.handlerId).invokeAction(action);
            eventEmitter.emitEvent("actionInvoked", { action });
        });
    }
}
