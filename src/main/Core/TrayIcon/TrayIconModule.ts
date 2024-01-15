import type { OperatingSystem } from "@common/OperatingSystem";
import { Menu, Tray, type NativeTheme } from "electron";
import type { DependencyInjector } from "../DependencyInjector";
import type { EventSubscriber } from "../EventSubscriber";
import type { SettingsManager } from "../SettingsManager";
import type { UeliCommandInvoker } from "../UeliCommand";
import { getContextMenuTemplate } from "./getContextMenuTemplate";
import { getTrayIconImage } from "./getTrayIconImage";

export class TrayIconModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const eventSubscriber = dependencyInjector.getInstance<EventSubscriber>("EventSubscriber");
        const nativeTheme = dependencyInjector.getInstance<NativeTheme>("NativeTheme");
        const operatingSystem = dependencyInjector.getInstance<OperatingSystem>("OperatingSystem");
        const settingsManager = dependencyInjector.getInstance<SettingsManager>("SettingsManager");
        const ueliCommandInvoker = dependencyInjector.getInstance<UeliCommandInvoker>("UeliCommandInvoker");

        const getCurrentLanguage = () => settingsManager.getValue<string>("general.language", "en-US");

        const setTrayContextMenu = async (tray: Tray) => {
            tray.setContextMenu(
                Menu.buildFromTemplate(
                    await getContextMenuTemplate({
                        language: getCurrentLanguage(),
                        ueliCommandInvoker,
                    }),
                ),
            );
        };

        const tray = new Tray(getTrayIconImage(operatingSystem, nativeTheme));

        setTrayContextMenu(tray);

        nativeTheme.on("updated", () => tray.setImage(getTrayIconImage(operatingSystem, nativeTheme)));

        eventSubscriber.subscribe("settingUpdated[general.language]", () => setTrayContextMenu(tray));
    }
}
