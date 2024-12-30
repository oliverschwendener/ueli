import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { OperatingSystem } from "@common/Core";
import { ContextMenuBuilder } from "./ContextMenuBuilder";
import { ContextMenuTemplateProvider } from "./ContextMenuTemplateProvider";
import { TrayCreator } from "./TrayCreator";
import {
    LinuxTrayIconFilePathResolver,
    MacOsTrayIconFilePathResolver,
    WindowsTrayIconFilePathResolver,
    type TrayIconFilePathResolver,
} from "./TrayIconFilePathResolver";
import { TrayIconManager } from "./TrayIconManager";
import { resources } from "./resources";

export class TrayIconModule {
    public static async bootstrap(moduleRegistry: UeliModuleRegistry) {
        const nativeTheme = moduleRegistry.get("NativeTheme");
        const assetPathResolver = moduleRegistry.get("AssetPathResolver");
        const operatingSystem = moduleRegistry.get("OperatingSystem");

        const trayIconFilePathResolvers: Record<OperatingSystem, () => TrayIconFilePathResolver> = {
            Linux: () => new LinuxTrayIconFilePathResolver(nativeTheme, assetPathResolver),
            macOS: () => new MacOsTrayIconFilePathResolver(assetPathResolver),
            Windows: () => new WindowsTrayIconFilePathResolver(nativeTheme, assetPathResolver),
        };

        const trayIconManager = new TrayIconManager(
            new TrayCreator(),
            trayIconFilePathResolvers[operatingSystem](),
            new ContextMenuTemplateProvider(
                moduleRegistry.get("Translator"),
                moduleRegistry.get("UeliCommandInvoker"),
                moduleRegistry.get("SettingsManager"),
                resources,
            ),
            new ContextMenuBuilder(),
        );

        await trayIconManager.createTrayIcon();

        nativeTheme.on("updated", () => trayIconManager.updateImage());

        const eventSubscriber = moduleRegistry.get("EventSubscriber");

        eventSubscriber.subscribe("settingUpdated[general.language]", () => trayIconManager.updateContextMenu());
        eventSubscriber.subscribe("settingUpdated[general.hotkey.enabled]", () => trayIconManager.updateContextMenu());
    }
}
