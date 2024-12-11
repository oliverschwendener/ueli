import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
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
    public static async bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const nativeTheme = dependencyRegistry.get("NativeTheme");
        const assetPathResolver = dependencyRegistry.get("AssetPathResolver");
        const operatingSystem = dependencyRegistry.get("OperatingSystem");

        const trayIconFilePathResolvers: Record<OperatingSystem, () => TrayIconFilePathResolver> = {
            Linux: () => new LinuxTrayIconFilePathResolver(nativeTheme, assetPathResolver),
            macOS: () => new MacOsTrayIconFilePathResolver(assetPathResolver),
            Windows: () => new WindowsTrayIconFilePathResolver(nativeTheme, assetPathResolver),
        };

        const trayIconManager = new TrayIconManager(
            new TrayCreator(),
            trayIconFilePathResolvers[operatingSystem](),
            new ContextMenuTemplateProvider(
                dependencyRegistry.get("Translator"),
                dependencyRegistry.get("UeliCommandInvoker"),
                dependencyRegistry.get("SettingsManager"),
                resources,
            ),
            new ContextMenuBuilder(),
        );

        await trayIconManager.createTrayIcon();

        nativeTheme.on("updated", () => trayIconManager.updateImage());

        const eventSubscriber = dependencyRegistry.get("EventSubscriber");

        eventSubscriber.subscribe("settingUpdated[general.language]", () => trayIconManager.updateContextMenu());
        eventSubscriber.subscribe("settingUpdated[general.hotkey.enabled]", () => trayIconManager.updateContextMenu());
    }
}
