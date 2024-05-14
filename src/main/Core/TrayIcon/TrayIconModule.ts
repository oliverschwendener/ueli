import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { OperatingSystem } from "@common/Core";
import { Menu, Tray } from "electron";
import {
    LinuxTrayIconFilePathResolver,
    MacOsTrayIconFilePathResolver,
    TrayIconFilePathResolver,
    WindowsTrayIconFilePathResolver,
} from "./TrayIconFilePathResolver";
import { getContextMenuTemplate } from "./getContextMenuTemplate";

export class TrayIconModule {
    public static async bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const eventSubscriber = dependencyRegistry.get("EventSubscriber");
        const nativeTheme = dependencyRegistry.get("NativeTheme");
        const operatingSystem = dependencyRegistry.get("OperatingSystem");
        const ueliCommandInvoker = dependencyRegistry.get("UeliCommandInvoker");
        const translator = dependencyRegistry.get("Translator");
        const assetPathResolver = dependencyRegistry.get("AssetPathResolver");

        const trayIconFilePathResolvers: Record<OperatingSystem, () => TrayIconFilePathResolver> = {
            Linux: () => new LinuxTrayIconFilePathResolver(nativeTheme, assetPathResolver),
            macOS: () => new MacOsTrayIconFilePathResolver(assetPathResolver),
            Windows: () => new WindowsTrayIconFilePathResolver(nativeTheme, assetPathResolver),
        };

        const trayIconFilePathResolver = trayIconFilePathResolvers[operatingSystem]();

        const setTrayContextMenu = async (tray: Tray) => {
            const template = await getContextMenuTemplate({ translator, ueliCommandInvoker });
            tray.setContextMenu(Menu.buildFromTemplate(template));
        };

        const tray = new Tray(trayIconFilePathResolver.resolve());

        await setTrayContextMenu(tray);

        nativeTheme.on("updated", () => tray.setImage(trayIconFilePathResolver.resolve()));

        eventSubscriber.subscribe("settingUpdated[general.language]", () => setTrayContextMenu(tray));
    }
}
