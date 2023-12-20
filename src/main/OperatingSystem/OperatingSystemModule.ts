import type { OperatingSystem } from "@common/OperatingSystem";
import type { IpcMain } from "electron";
import type { DependencyInjector } from "../DependencyInjector";
import { getOperatingSystemFromPlatform } from "./getOperatingSystemFromPlatform";

export class OperatingSystemModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const platform = dependencyInjector.getInstance<string>("Platform");
        const ipcMain = dependencyInjector.getInstance<IpcMain>("IpcMain");

        const operatingSystem = getOperatingSystemFromPlatform(platform);
        dependencyInjector.registerInstance<OperatingSystem>("OperatingSystem", operatingSystem);

        ipcMain.on("getOperatingSystem", (event) => (event.returnValue = operatingSystem));
    }
}
