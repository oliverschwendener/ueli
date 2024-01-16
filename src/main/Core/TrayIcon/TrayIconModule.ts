import type { OperatingSystem } from "@common/Core";
import { Menu, Tray, type NativeTheme } from "electron";
import type { AssetPathResolver, DependencyInjector, EventSubscriber, Translator, UeliCommandInvoker } from "..";
import { getContextMenuTemplate } from "./getContextMenuTemplate";
import { getTrayIconImage } from "./getTrayIconImage";

export class TrayIconModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const eventSubscriber = dependencyInjector.getInstance<EventSubscriber>("EventSubscriber");
        const nativeTheme = dependencyInjector.getInstance<NativeTheme>("NativeTheme");
        const operatingSystem = dependencyInjector.getInstance<OperatingSystem>("OperatingSystem");
        const ueliCommandInvoker = dependencyInjector.getInstance<UeliCommandInvoker>("UeliCommandInvoker");
        const translator = dependencyInjector.getInstance<Translator>("Translator");
        const assetPathResolver = dependencyInjector.getInstance<AssetPathResolver>("AssetPathResolver");

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
