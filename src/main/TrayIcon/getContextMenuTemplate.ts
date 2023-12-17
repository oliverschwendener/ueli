import type { MenuItemConstructorOptions } from "electron";

export const getContextMenuTemplate = (language: string): MenuItemConstructorOptions[] => {
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
            click: () => console.log("todo: show window"),
        },
        {
            label: translations[language].settings,
            click: () => console.log("todo: show window and go to settings"),
        },
        {
            label: translations[language].quit,
            click: () => console.log("todo: quit app"),
        },
    ];
};
