import type { AboutUeli } from "@common/Core";
import type { DependencyRegistry } from "../DependencyRegistry";

export class AboutUeliModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry) {
        const app = dependencyRegistry.get("App");
        const ipcMain = dependencyRegistry.get("IpcMain");

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
