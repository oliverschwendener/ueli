import type { App, MenuItemConstructorOptions } from "electron";
import type { EventEmitter } from "../EventEmitter";
import type { SettingsManager } from "../SettingsManager";

export const getContextMenuTemplate = ({
    app,
    eventEmitter,
    settingsManager,
}: {
    app: App;
    eventEmitter: EventEmitter;
    settingsManager: SettingsManager;
}): MenuItemConstructorOptions[] => {
    const language = settingsManager.getSettingByKey<string>("general.language", "en-US");

    const translations: Record<string, { show: string; settings: string; quit: string }> = {
        "en-US": {
            quit: "Quit",
            settings: "Settings",
            show: "Show",
        },
        "de-CH": {
            quit: "Beenden",
            settings: "Einstellungen",
            show: "Anzeigen",
        },
    };

    return [
        {
            label: translations[language].show,
            click: () => eventEmitter.emitEvent("trayIconContextMenuShowClicked"),
        },
        {
            label: translations[language].settings,
            click: () => eventEmitter.emitEvent("trayIconContextMenuSettingsClicked"),
        },
        {
            label: translations[language].quit,
            click: () => app.quit(),
        },
    ];
};
