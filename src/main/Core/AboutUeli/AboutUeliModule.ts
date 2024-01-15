import type { AboutUeli } from "@common/AboutUeli";
import type { App, IpcMain } from "electron";
import packageJson from "../../../../package.json";
import type { DependencyInjector } from "../DependencyInjector";

export class AboutUeliModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const app = dependencyInjector.getInstance<App>("App");
        const ipcMain = dependencyInjector.getInstance<IpcMain>("IpcMain");

        ipcMain.on("getAboutUeli", (event) => {
            event.returnValue = <AboutUeli>{
                electronVersion: process.versions.electron,
                fluentUiReactIconsVersion: packageJson.dependencies["@fluentui/react-icons"],
                fluentUiReactComponentsVersion: packageJson.dependencies["@fluentui/react-components"],
                nodeJsVersion: process.versions.node,
                v8Version: process.versions.v8,
                version: app.getVersion(),
            };
        });
    }
}
