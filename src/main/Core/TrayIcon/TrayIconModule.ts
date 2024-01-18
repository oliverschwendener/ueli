import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { Menu, Tray } from "electron";
import { getContextMenuTemplate } from "./getContextMenuTemplate";
import { getTrayIconImage } from "./getTrayIconImage";

export class TrayIconModule {
    public static async bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
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

        await setTrayContextMenu(tray);

        nativeTheme.on("updated", () =>
            tray.setImage(getTrayIconImage(assetPathResolver, operatingSystem, nativeTheme)),
        );

        eventSubscriber.subscribe("settingUpdated[general.language]", () => setTrayContextMenu(tray));
    }
}
