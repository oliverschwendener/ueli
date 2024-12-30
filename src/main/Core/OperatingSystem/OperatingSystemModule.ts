import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { getOperatingSystemFromPlatform } from "./getOperatingSystemFromPlatform";

export class OperatingSystemModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const platform = moduleRegistry.get("Platform");
        const ipcMain = moduleRegistry.get("IpcMain");

        const operatingSystem = getOperatingSystemFromPlatform(platform);
        moduleRegistry.register("OperatingSystem", operatingSystem);

        ipcMain.on("getOperatingSystem", (event) => (event.returnValue = operatingSystem));
    }
}
