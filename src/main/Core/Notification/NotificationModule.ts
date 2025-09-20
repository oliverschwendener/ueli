import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { ElectronNotificationService } from "./NotificationService";

export class NotificationModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        moduleRegistry.register("NotificationService", new ElectronNotificationService());
    }
}
