import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { Notification } from "./Notification";

export class NotificationModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const appIconFilePathResolver = moduleRegistry.get("AppIconFilePathResolver");
        moduleRegistry.register("Notification", new Notification(appIconFilePathResolver));
    }
}
