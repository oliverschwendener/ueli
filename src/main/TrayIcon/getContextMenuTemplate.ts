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

    const translationSet = translations[language] ?? translations["en-US"];

    return [
        {
            label: translationSet.show,
            click: () => eventEmitter.emitEvent("trayIconContextMenuShowClicked"),
        },
        {
            label: translationSet.settings,
            click: () => eventEmitter.emitEvent("trayIconContextMenuSettingsClicked"),
        },
        {
            label: translationSet.quit,
            click: () => app.quit(),
        },
    ];
};
