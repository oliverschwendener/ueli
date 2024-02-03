import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { FavoriteManager } from "./FavoriteManager";

export class FavoriteManagerModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const settingsManager = dependencyRegistry.get("SettingsManager");
        const ipcMain = dependencyRegistry.get("IpcMain");
        const eventEmitter = dependencyRegistry.get("EventEmitter");

        const f = new FavoriteManager(settingsManager, eventEmitter);

        dependencyRegistry.register("FavoriteManager", f);

        ipcMain.on("getFavorites", (event) => {
            event.returnValue = f.getAll();
        });

        ipcMain.handle("removeFavorite", async (_, { id }: { id: string }) => {
            await f.remove(id);
        });
    }
}
