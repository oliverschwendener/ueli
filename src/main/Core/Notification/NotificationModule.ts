import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { ElectronNotificationService } from "./NotificationService";

export class NotificationModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const assetPathResolver = moduleRegistry.get("AssetPathResolver");
        moduleRegistry.register(
            "NotificationService",
            new ElectronNotificationService(assetPathResolver.getModuleAssetPath("Notification", "icon.png")),
        );
    }
}
