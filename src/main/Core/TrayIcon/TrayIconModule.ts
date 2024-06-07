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
        const translator = dependencyRegistry.get("Translator");
        const ueliCommandInvoker = dependencyRegistry.get("UeliCommandInvoker");
        const eventSubscriber = dependencyRegistry.get("EventSubscriber");

        const trayIconFilePathResolvers: Record<OperatingSystem, () => TrayIconFilePathResolver> = {
            Linux: () => new LinuxTrayIconFilePathResolver(nativeTheme, assetPathResolver),
            macOS: () => new MacOsTrayIconFilePathResolver(assetPathResolver),
            Windows: () => new WindowsTrayIconFilePathResolver(nativeTheme, assetPathResolver),
        };

        const trayIconManager = new TrayIconManager(
            new TrayCreator(),
            trayIconFilePathResolvers[operatingSystem](),
            new ContextMenuTemplateProvider(translator, ueliCommandInvoker, resources),
            new ContextMenuBuilder(),
            nativeTheme,
            eventSubscriber,
        );

        await trayIconManager.createTrayIcon();

        trayIconManager.registerEventListeners();
    }
}
