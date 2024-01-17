import { Menu, Tray } from "electron";
import type { DependencyRegistry } from "..";
import { getContextMenuTemplate } from "./getContextMenuTemplate";
import { getTrayIconImage } from "./getTrayIconImage";

export class TrayIconModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry) {
        const eventSubscriber = dependencyRegistry.get("EventSubscriber");
        const nativeTheme = dependencyRegistry.get("NativeTheme");
        const operatingSystem = dependencyRegistry.get("OperatingSystem");
        const ueliCommandInvoker = dependencyRegistry.get("UeliCommandInvoker");
        const translator = dependencyRegistry.get("Translator");
        const assetPathResolver = dependencyRegistry.get("AssetPathResolver");

        const setTrayContextMenu = async (tray: Tray) => {
            tray.setContextMenu(
                Menu.buildFromTemplate(await getContextMenuTemplate({ translator, ueliCommandInvoker })),
            );
        };

        const tray = new Tray(getTrayIconImage(assetPathResolver, operatingSystem, nativeTheme));

        setTrayContextMenu(tray);

        nativeTheme.on("updated", () =>
            tray.setImage(getTrayIconImage(assetPathResolver, operatingSystem, nativeTheme)),
        );

        eventSubscriber.subscribe("settingUpdated[general.language]", () => setTrayContextMenu(tray));
    }
}
