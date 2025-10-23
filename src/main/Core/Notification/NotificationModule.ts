import { AppIconFilePathResolver } from "@Core/BrowserWindow/AppIconFilePathResolver";
import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { ElectronNotificationService } from "./NotificationService";

export class NotificationModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const assetPathResolver = moduleRegistry.get("AssetPathResolver");
        const appIconFilePathResolver = new AppIconFilePathResolver(
            moduleRegistry.get("NativeTheme"),
            assetPathResolver,
            moduleRegistry.get("OperatingSystem"),
        );
        moduleRegistry.register(
            "NotificationService",
            new ElectronNotificationService(appIconFilePathResolver.getAppIconFilePath()),
        );
    }
}
