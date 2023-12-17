import { Menu, Tray, type NativeTheme } from "electron";
import type { DependencyInjector } from "../DependencyInjector";
import type { EventEmitter } from "../EventEmitter";
import { EventSubscriber } from "../EventSubscriber";
import { OperatingSystem } from "../OperatingSystem";
import { SettingsManager } from "../SettingsManager";
import { getContextMenuTemplate } from "./getContextMenuTemplate";
import { getTrayIconImage } from "./getTrayIconImage";

export class TrayIconModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const eventEmitter = dependencyInjector.getInstance<EventEmitter>("EventEmitter");
        const eventSubscriber = dependencyInjector.getInstance<EventSubscriber>("EventSubscriber");
        const nativeTheme = dependencyInjector.getInstance<NativeTheme>("NativeTheme");
        const operatingSystem = dependencyInjector.getInstance<OperatingSystem>("OperatingSystem");
        const settingsManager = dependencyInjector.getInstance<SettingsManager>("SettingsManager");

        const tray = new Tray(getTrayIconImage(operatingSystem, nativeTheme));

        tray.setContextMenu(
            Menu.buildFromTemplate(
                getContextMenuTemplate(settingsManager.getSettingByKey<string>("general.language", "en-US")),
            ),
        );

        tray.on("click", () => eventEmitter.emitEvent("trayIconClicked"));

        nativeTheme.on("updated", () => tray.setImage(getTrayIconImage(operatingSystem, nativeTheme)));

        eventSubscriber.subscribe<{ key: string; value: string }>("settingUpdated", ({ key, value }) => {
            if (key === "general.language") {
                tray.setContextMenu(Menu.buildFromTemplate(getContextMenuTemplate(value)));
            }
        });
    }
}
