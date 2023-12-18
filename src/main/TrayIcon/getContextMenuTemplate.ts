import type { App, MenuItemConstructorOptions } from "electron";
import { init, t } from "i18next";
import type { EventEmitter } from "../EventEmitter";
import type { SettingsManager } from "../SettingsManager";

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
        resources: {
            "en-US": {
                translation: {
                    "trayIcon.contextMenu.about": "About",
                    "trayIcon.contextMenu.quit": "Quit",
                    "trayIcon.contextMenu.settings": "Settings",
                    "trayIcon.contextMenu.show": "Show",
                },
            },
            "de-CH": {
                translation: {
                    "trayIcon.contextMenu.about": "Über",
                    "trayIcon.contextMenu.quit": "Beenden",
                    "trayIcon.contextMenu.settings": "Einstellungen",
                    "trayIcon.contextMenu.show": "Anzeigen",
                },
            },
        },
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
            label: t("trayIcon.contextMenu.about"),
            click: () => eventEmitter.emitEvent("trayIconContextMenuAboutClicked"),
        },
        {
            label: t("trayIcon.contextMenu.quit"),
            click: () => app.quit(),
        },
    ];
};
