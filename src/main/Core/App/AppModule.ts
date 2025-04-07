import type { UeliModuleRegistry } from "@Core/ModuleRegistry";

export class App {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const app = moduleRegistry.get("App");
        const ipcMain = moduleRegistry.get("IpcMain");

        ipcMain.on("restartApp", () => {
            app.relaunch();
            app.exit();
        });
    }
}
