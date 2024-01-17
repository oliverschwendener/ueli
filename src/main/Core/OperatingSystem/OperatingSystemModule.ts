import type { DependencyInjector } from "../DependencyInjector";
import { getOperatingSystemFromPlatform } from "./getOperatingSystemFromPlatform";

export class OperatingSystemModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const platform = dependencyInjector.getInstance("Platform");
        const ipcMain = dependencyInjector.getInstance("IpcMain");

        const operatingSystem = getOperatingSystemFromPlatform(platform);
        dependencyInjector.registerInstance("OperatingSystem", operatingSystem);

        ipcMain.on("getOperatingSystem", (event) => (event.returnValue = operatingSystem));
    }
}
