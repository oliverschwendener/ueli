import { Menu, Tray, type App, type NativeTheme } from "electron";
import type { DependencyInjector } from "../DependencyInjector";
import type { EventEmitter } from "../EventEmitter";
import type { EventSubscriber } from "../EventSubscriber";
import type { OperatingSystem } from "../OperatingSystem";
import type { SettingsManager } from "../SettingsManager";
import { getContextMenuTemplate } from "./getContextMenuTemplate";
import { getTrayIconImage } from "./getTrayIconImage";

export class TrayIconModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const app = dependencyInjector.getInstance<App>("App");
        const eventSubscriber = dependencyInjector.getInstance<EventSubscriber>("EventSubscriber");
        const eventEmitter = dependencyInjector.getInstance<EventEmitter>("EventEmitter");
        const nativeTheme = dependencyInjector.getInstance<NativeTheme>("NativeTheme");
        const operatingSystem = dependencyInjector.getInstance<OperatingSystem>("OperatingSystem");
        const settingsManager = dependencyInjector.getInstance<SettingsManager>("SettingsManager");

        const setTrayContextMenu = async (tray: Tray) => {
            const contextMeuTemplate = await getContextMenuTemplate({ app, eventEmitter, settingsManager });
            tray.setContextMenu(Menu.buildFromTemplate(contextMeuTemplate));
        };

        const tray = new Tray(getTrayIconImage(operatingSystem, nativeTheme));

        setTrayContextMenu(tray);

        nativeTheme.on("updated", () => tray.setImage(getTrayIconImage(operatingSystem, nativeTheme)));

        eventSubscriber.subscribe("settingUpdated[general.language]", () => setTrayContextMenu(tray));
    }
}
