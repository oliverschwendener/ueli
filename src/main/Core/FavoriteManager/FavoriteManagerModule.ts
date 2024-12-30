import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { FavoritesActionHandler } from "./ActionHandler";
import { FavoriteManager } from "./FavoriteManager";

export class FavoriteManagerModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const ipcMain = moduleRegistry.get("IpcMain");

        const favoriteManager = new FavoriteManager(
            moduleRegistry.get("SettingsManager"),
            moduleRegistry.get("BrowserWindowNotifier"),
        );

        moduleRegistry.get("ActionHandlerRegistry").register(new FavoritesActionHandler(favoriteManager));

        ipcMain.on("getFavorites", (event) => (event.returnValue = favoriteManager.getAll()));

        ipcMain.handle("removeFavorite", async (_, { id }: { id: string }) => await favoriteManager.remove(id));
    }
}
