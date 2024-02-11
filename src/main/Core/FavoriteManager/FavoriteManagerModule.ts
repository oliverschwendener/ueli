import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { FavoriteManager } from "./FavoriteManager";

export class FavoriteManagerModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const ipcMain = dependencyRegistry.get("IpcMain");

        const favoriteManager = new FavoriteManager(
            dependencyRegistry.get("SettingsManager"),
            dependencyRegistry.get("BrowserWindowNotifier"),
        );

        dependencyRegistry.register("FavoriteManager", favoriteManager);

        ipcMain.on("getFavorites", (event) => (event.returnValue = favoriteManager.getAll()));

        ipcMain.handle("removeFavorite", async (_, { id }: { id: string }) => await favoriteManager.remove(id));
    }
}
