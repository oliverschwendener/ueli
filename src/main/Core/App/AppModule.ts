import type { UeliModuleRegistry } from "@Core/ModuleRegistry";

export class App {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const app = moduleRegistry.get("App");
        const ipcMain = moduleRegistry.get("IpcMain");

        if (process.platform === "win32") {
            app.setAppUserModelId("OliverSchwendener.Ueli");
        }

        ipcMain.on("restartApp", () => {
            app.relaunch();
            app.exit();
        });
    }
}
