import type { App, MenuItemConstructorOptions } from "electron";
import { init, t } from "i18next";
import type { EventEmitter } from "../EventEmitter";
import type { SettingsManager } from "../SettingsManager";
import { resources } from "./I18n";

export const getContextMenuTemplate = async ({
    app,
    eventEmitter,
    settingsManager,
}: {
    app: App;
    eventEmitter: EventEmitter;
    settingsManager: SettingsManager;
}): Promise<MenuItemConstructorOptions[]> => {
    await init({
        resources,
        lng: settingsManager.getSettingByKey<string>("general.language", "en-US"),
        fallbackLng: "en-US",
    });

    return [
        {
            label: t("trayIcon.contextMenu.show"),
            click: () => eventEmitter.emitEvent("trayIconContextMenuShowClicked"),
        },
        {
            label: t("trayIcon.contextMenu.settings"),
            click: () => eventEmitter.emitEvent("trayIconContextMenuSettingsClicked"),
        },
        {
            label: t("trayIcon.contextMenu.quit"),
            click: () => app.quit(),
        },
    ];
};
