import type { Resources } from "@common/Core/Translator";
import type { TrayIconTranslations } from "./TrayIconTranslations";

export const resources: Resources<TrayIconTranslations> = {
    "en-US": {
        "trayIcon.contextMenu.about": "About",
        "trayIcon.contextMenu.quit": "Quit",
        "trayIcon.contextMenu.settings": "Settings",
        "trayIcon.contextMenu.show": "Show",
        "trayIcon.contextMenu.hotkey": "Hotkey",
        "trayIcon.contextMenu.hotkey.tooltip": "Click to enable/disable the hotkey",
    },
    "de-CH": {
        "trayIcon.contextMenu.about": "Über",
        "trayIcon.contextMenu.quit": "Beenden",
        "trayIcon.contextMenu.settings": "Einstellungen",
        "trayIcon.contextMenu.show": "Anzeigen",
        "trayIcon.contextMenu.hotkey": "Tastenkombination",
        "trayIcon.contextMenu.hotkey.tooltip": "Klick um die Tastenkombination zu aktivieren/deaktivieren",
    },
};
