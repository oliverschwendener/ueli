import type { DependencyRegistry } from "../DependencyRegistry";
import { getOperatingSystemFromPlatform } from "./getOperatingSystemFromPlatform";

export class OperatingSystemModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry) {
        const platform = dependencyRegistry.get("Platform");
        const ipcMain = dependencyRegistry.get("IpcMain");

        const operatingSystem = getOperatingSystemFromPlatform(platform);
        dependencyRegistry.register("OperatingSystem", operatingSystem);

        ipcMain.on("getOperatingSystem", (event) => (event.returnValue = operatingSystem));
    }
}
