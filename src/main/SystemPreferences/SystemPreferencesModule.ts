import type { IpcMain, SystemPreferences } from "electron";
import type { DependencyInjector } from "../DependencyInjector";

export class SystemPreferencesModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const systemPreferences = dependencyInjector.getInstance<SystemPreferences>("SystemPreferences");
        const ipcMain = dependencyInjector.getInstance<IpcMain>("IpcMain");

        ipcMain.on("getAccentColor", (event) => (event.returnValue = systemPreferences.getAccentColor()));
    }
}
