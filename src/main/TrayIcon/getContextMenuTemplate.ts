import type { MenuItemConstructorOptions } from "electron";
import { init, t } from "i18next";
import type { SettingsManager } from "../SettingsManager";
import type { UeliCommandInvoker } from "../UeliCommand";

export const getContextMenuTemplate = async ({
    settingsManager,
    ueliCommandInvoker,
}: {
    settingsManager: SettingsManager;
    ueliCommandInvoker: UeliCommandInvoker;
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
            click: () => ueliCommandInvoker.invokeUeliCommand("show"),
        },
        {
            label: t("trayIcon.contextMenu.settings"),
            click: () => ueliCommandInvoker.invokeUeliCommand("openSettings"),
        },
        {
            label: t("trayIcon.contextMenu.about"),
            click: () => ueliCommandInvoker.invokeUeliCommand("openAbout"),
        },
        {
            label: t("trayIcon.contextMenu.quit"),
            click: () => ueliCommandInvoker.invokeUeliCommand("quit"),
        },
    ];
};
