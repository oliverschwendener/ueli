import type { InitOptions } from "i18next";

export const resources: InitOptions["resources"] = {
    "en-US": {
        translation: {
            "general.settings": "Settings",
            "general.actions": "Actions",
            "settingsGeneral.language": "Language",
            "settingsAppearance.themeName": "Theme",
            "settingsPage.about": "About",
            "settingsPage.debug": "Debug",
            "settingsPage.appearance": "Appearance",
            "settingsPage.general": "General",
            "settingsPage.extensions": "Extensions",
            "settingsPage.searchEngine": "Search Engine",
            "settingsPage.window": "Window",
            "settings.extensions.noSettingsAvailable": "No settings available",
            "settingsSearchEngine.automaticRescan": "Automatic rescan",
            "settingsSearchEngine.fuzzyness": "Fuzzyness",
            "settingsSearchEngine.rescanIntervalInSeconds": "Rescan interval (in seconds)",
            "settingsWindow.hideWindowAfterExecution": "Hide window after execution",
            "settingsWindow.hideWindowOnBlur": "Hide window on blur",
            "extension[ApplicationSearch].searchResultItemDescription": "Application",
            "extension[ApplicationSearch].searchResultItem.defaultAction.openApplication": "Open application",
            "extension[ApplicationSearch].searchResultItem.additionalAction.showInFileExplorer":
                "Show in file explorer",
            "extension[ApplicationSearch].searchResultItem.additionalAction.copyFilePathToClipboard":
                "Copy file path to clipboard",
            "extension[ApplicationSearch].extensionName": "Application Search",
            "extension[SystemColorThemeSwitcher].extensionName": "System Color Theme Switcher",
            "extension[UeliCommand].extensionName": "Ueli Commands",
        },
    },
    "de-CH": {
        translation: {
            "general.settings": "Einstellungen",
            "general.actions": "Aktionen",
            "settingsGeneral.language": "Sprache",
            "settingsAppearance.themeName": "Theme",
            "settingsPage.about": "Über",
            "settingsPage.debug": "Fehlerbehebung",
            "settingsPage.appearance": "Erscheinungsbild",
            "settingsPage.general": "Allgemein",
            "settingsPage.extensions": "Erweiterungen",
            "settingsPage.searchEngine": "Suchmaschine",
            "settingsPage.window": "Fenster",
            "settings.extensions.noSettingsAvailable": "Keine Einstellungen verfügbar",
            "settingsSearchEngine.automaticRescan": "Automatisches Neuscannen",
            "settingsSearchEngine.fuzzyness": "Fuzzyness",
            "settingsSearchEngine.rescanIntervalInSeconds": "Neuscan-Intervall (in Sekunden)",
            "settingsWindow.hideWindowAfterExecution": "Fenster verstecken nach Ausführung",
            "settingsWindow.hideWindowOnBlur": "Fenster verstecken bei Fokusverlust",
            "extension[ApplicationSearch].searchResultItemDescription": "Anwendung",
            "extension[ApplicationSearch].extensionName": "Anwendungssuche",
            "extension[ApplicationSearch].searchResultItem.defaultAction.openApplication": "Anwendung öffnen",
            "extension[ApplicationSearch].searchResultItem.additionalAction.showInFileExplorer":
                "Im Datei-Explorer anzeigen",
            "extension[ApplicationSearch].searchResultItem.additionalAction.copyFilePathToClipboard":
                "Dateipfad in Zwischenablage kopieren",
            "extension[SystemColorThemeSwitcher].extensionName": "System Color Theme Switcher",
            "extension[UeliCommand].extensionName": "Ueli Befehle",
        },
    },
};
