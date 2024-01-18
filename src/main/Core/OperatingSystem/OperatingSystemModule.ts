import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { getOperatingSystemFromPlatform } from "./getOperatingSystemFromPlatform";

export class OperatingSystemModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const platform = dependencyRegistry.get("Platform");
        const ipcMain = dependencyRegistry.get("IpcMain");

        const operatingSystem = getOperatingSystemFromPlatform(platform);
        dependencyRegistry.register("OperatingSystem", operatingSystem);

        ipcMain.on("getOperatingSystem", (event) => (event.returnValue = operatingSystem));
    }
}
