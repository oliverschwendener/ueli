import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { AboutUeli } from "@common/Core";

export class AboutUeliModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
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
