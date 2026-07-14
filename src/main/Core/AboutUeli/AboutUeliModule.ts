import type { AboutUeli } from "@common/Core";
import type { UeliModuleRegistry } from "@Core/ModuleRegistry";

export class AboutUeliModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const app = moduleRegistry.get("App");
        const ipcMain = moduleRegistry.get("IpcMain");

        ipcMain.on("getAboutUeli", (event) => {
            event.returnValue = <AboutUeli>{
                electronVersion: process.versions.electron,
                nodeJsVersion: process.versions.node,
                v8Version: process.versions.v8,
                version: app.getVersion(),
            };
        });
    }
}
