import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { ElectronNotification } from "./Notification";

export class NotificationModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const appIconFilePathResolver = moduleRegistry.get("AppIconFilePathResolver");
        moduleRegistry.register("Notification", new ElectronNotification(appIconFilePathResolver));
    }
}
