import { Menu, Tray } from "electron";
import type { DependencyInjector } from "..";
import { getContextMenuTemplate } from "./getContextMenuTemplate";
import { getTrayIconImage } from "./getTrayIconImage";

export class TrayIconModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const eventSubscriber = dependencyInjector.getInstance("EventSubscriber");
        const nativeTheme = dependencyInjector.getInstance("NativeTheme");
        const operatingSystem = dependencyInjector.getInstance("OperatingSystem");
        const ueliCommandInvoker = dependencyInjector.getInstance("UeliCommandInvoker");
        const translator = dependencyInjector.getInstance("Translator");
        const assetPathResolver = dependencyInjector.getInstance("AssetPathResolver");

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
