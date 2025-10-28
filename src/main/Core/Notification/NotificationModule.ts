import type { AppIconFilePathResolver } from "@Core/AppIconFilePathResolver";
import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { ElectronNotification } from "./Notification";

export class NotificationModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const appIconFilePathResolver = moduleRegistry.get("AppIconFilePathResolver") as AppIconFilePathResolver;
        moduleRegistry.register("Notification", new ElectronNotification(appIconFilePathResolver.getAppIconFilePath()));
    }
}
