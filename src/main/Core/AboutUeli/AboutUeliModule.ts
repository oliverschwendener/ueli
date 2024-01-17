import type { AboutUeli } from "@common/Core";
import type { DependencyInjector } from "../DependencyInjector";

export class AboutUeliModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const app = dependencyInjector.getInstance("App");
        const ipcMain = dependencyInjector.getInstance("IpcMain");

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
