import type { InitOptions } from "i18next";

export const resources: InitOptions["resources"] = {
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
};
