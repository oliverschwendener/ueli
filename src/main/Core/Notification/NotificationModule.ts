import { AppIconFilePathResolver } from "@Core/AppIconFilePathResolver";
import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { ElectronNotification } from "./Notification";

export class NotificationModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const assetPathResolver = moduleRegistry.get("AssetPathResolver");
        const appIconFilePathResolver = new AppIconFilePathResolver(
            moduleRegistry.get("NativeTheme"),
            assetPathResolver,
            moduleRegistry.get("OperatingSystem"),
        );
        moduleRegistry.register("Notification", new ElectronNotification(appIconFilePathResolver.getAppIconFilePath()));
    }
}
