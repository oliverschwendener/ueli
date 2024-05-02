import type { Translations } from "@common/Core/Extension";

export const getCoreTranslations = (): { namespace: string; translations: Translations }[] => {
    return [
        {
            namespace: "general",
            translations: {
                "en-US": {
                    settings: "Settings",
                    actions: "Actions",
                    copiedToClipboard: "Copied",
                },
                "de-CH": {
                    settings: "Einstellungen",
                    actions: "Aktionen",
                    copiedToClipboard: "Kopiert",
                },
            },
        },
        {
            namespace: "search",
            translations: {
                "en-US": {
                    placeholder: "Type to search...",
                    noResultsFoundFor: "No results found for",
                    noResultsFound: "No results found",
                },
                "de-CH": {
                    placeholder: "Suchbegriff eingeben...",
                    noResultsFoundFor: "Keine Suchergebnisse gefunden für",
                    noResultsFound: "Keine Suchergebnisse gefunden",
                },
            },
        },
        {
            namespace: "settingsGeneral",
            translations: {
                "en-US": {
                    title: "General",
                    hotkey: "Hotkey",
                    validHotkey: "Valid hotkey",
                    invalidHotkey: "Invalid hotkey",
                    saveHotkey: "Save",
                    hotkeyMoreInfo: "More info",
                    language: "Language",
                    autostart: "Start Ueli automatically after you log into the computer",
                },
                "de-CH": {
                    title: "Allgemein",
                    hotkey: "Tastenkombination",
                    validHotkey: "Gültige Tastenkombination",
                    invalidHotkey: "Ungültige Tastenkombination",
                    saveHotkey: "Speichern",
                    hotkeyMoreInfo: "Mehr Informationen",
                    language: "Sprache",
                    autostart: "Ueli automatisch starten, nach Anmelden am Computer",
                },
            },
        },
        {
            namespace: "settingsAppearance",
            translations: {
                "en-US": {
                    title: "Appearance",
                    themeName: "Theme",
                    customTheme: "Custom",
                    customThemeDarkShades: "Dark shades",
                    customThemeLightShades: "Light shades",
                    customThemeReset: "Reset",
                },
                "de-CH": {
                    title: "Erscheinungsbild",
                    themeName: "Theme",
                    customTheme: "Benutzerdefiniert",
                    customThemeDarkShades: "Dunkle Farben",
                    customThemeLightShades: "Helle Farben",
                    customThemeReset: "Zurücksetzen",
                },
            },
        },
        {
            namespace: "settingsKeyboardAndMouse",
            translations: {
                "en-US": {
                    title: "Keyboard & Mouse",
                    singleClickBehavior: "Single click behavior",
                    doubleClickBehavior: "Double click behavior",
                    selectSearchResultItem: "Select search result item",
                    invokeSearchResultItem: "Invoke search result item",
                },
                "de-CH": {
                    title: "Tastatur & Maus",
                    singleClickBehavior: "Einfachklick-Verhalten",
                    doubleClickBehavior: "Doppelklick-Verhalten",
                    selectSearchResultItem: "Suchergebniss anwählen",
                    invokeSearchResultItem: "Suchergebniss ausführen",
                },
            },
        },
        {
            namespace: "settingsDebug",
            translations: {
                "en-US": {
                    title: "Debug",
                    resetAllSettings: "Reset all settings",
                    resetAllSettingsHint:
                        "This resets all settings to their default values. You will lose all settings that you changed.",
                    resetAllSettingsButton: "Reset",
                    resetAllSettingsDialogTitle: "Are you sure?",
                    resetAllSettingsDialogContent: "You are about to reset all settings to their default values.",
                    resetAllSettingsCancel: "Cancel",
                    resetAllSettingsConfirm: "Yes, I'm sure",
                },
                "de-CH": {
                    title: "Fehlerbehebung",
                    resetAllSettings: "Alle Einstellungen zurücksetzen",
                    resetAllSettingsHint:
                        "Dadurch werden alle Einstellungen auf ihre Standardwerte zurückgesetzt. Du verlierst alle Einstellungen, die du geändert hast.",
                    resetAllSettingsButton: "Zurücksetzen",
                    resetAllSettingsDialogTitle: "Bist du sicher?",
                    resetAllSettingsDialogContent:
                        "Du bist dabei, alle Einstellungen auf ihre Standardwerte zurückzusetzen.",
                    resetAllSettingsCancel: "Abbrechen",
                    resetAllSettingsConfirm: "Ja, ich bin sicher",
                },
            },
        },
        {
            namespace: "settingsAbout",
            translations: {
                "en-US": {
                    title: "About",
                },
                "de-CH": {
                    title: "Über",
                },
            },
        },
        {
            namespace: "settingsExtensions",
            translations: {
                "en-US": {
                    title: "Extensions",
                    name: "Name",
                    author: "Author",
                    enabled: "Enabled",
                    rescan: "Rescan",
                    successfulRescan: "Successfully rescanned",
                    noSettingsAvailable: "No settings available",
                },
                "de-CH": {
                    title: "Erweiterungen",
                    name: "Name",
                    author: "Author",
                    enabled: "Aktiviert",
                    rescan: "Neuscan",
                    successfulRescan: "Erfolgreicher Neuscan",
                    noSettingsAvailable: "Keine Einstellungen verfügbar",
                },
            },
        },
        {
            namespace: "settingsSearchEngine",
            translations: {
                "en-US": {
                    title: "Search Engine",
                    automaticRescan: "Automatic rescan",
                    fuzziness: "Fuzziness",
                    maxResultLength: "Maximum search result items",
                    rescanIntervalInSeconds: "Rescan interval (in seconds)",
                    rescanIntervalTooShort: "Rescan interval must be at least 10 seconds",
                    rescanIntervalResetToDefault: "Reset to default",
                    excludedItems: "Excluded items",
                    noExcludedItems: "There are no excluded items",
                    removeExcludedItem: "Remove item",
                },
                "de-CH": {
                    title: "Suchmaschine",
                    automaticRescan: "Automatisches Neuscannen",
                    fuzziness: "Fuzziness",
                    maxResultLength: "Maximale Anzahl Suchergebnisse",
                    rescanIntervalInSeconds: "Neuscan-Intervall (in Sekunden)",
                    rescanIntervalTooShort: "Neuscan-Intervall muss mindestens 10 Sekunden betragen",
                    rescanIntervalResetToDefault: "Auf Standardwert zurücksetzen",
                    excludedItems: "Ausgeschlossene Elemente",
                    noExcludedItems: "Es gibt keine ausgeschlossene Elemente",
                    removeExcludedItem: "Element entfernen",
                },
            },
        },
        {
            namespace: "settingsFavorites",
            translations: {
                "en-US": {
                    title: "Favorites",
                    numberOfColumns: "Number of columns",
                    remove: "Remove",
                },
                "de-CH": {
                    title: "Favoriten",
                    numberOfColumns: "Anzahl Spalten",
                    remove: "Entfernen",
                },
            },
        },
        {
            namespace: "settingsWindow",
            translations: {
                "en-US": {
                    title: "Window",
                    hideWindowOnBlur: "Hide window on blur",
                    alwaysOnTop: "Always on top",
                    showOnStartup: "Show on startup",
                },
                "de-CH": {
                    title: "Fenster",
                    hideWindowOnBlur: "Fenster verstecken bei Fokusverlust",
                    alwaysOnTop: "Immer im Vordergrund",
                    showOnStartup: "Beim Start anzeigen",
                },
            },
        },
        {
            namespace: "searchResultItemAction",
            translations: {
                "en-US": {
                    excludeFromSearchResults: "Exclude from search results",
                    openUrlInBrowser: "Open URL in web browser",
                    showInFileExplorer: "Show in file explorer",
                    addToFavorites: "Add to favorites",
                    removeFromFavorites: "Remove from favorites",
                },
                "de-CH": {
                    excludeFromSearchResults: "Von Suchergebnissen ausschliessen",
                    openUrlInBrowser: "URL in Webbrowser öffnen",
                    showInFileExplorer: "Im Datei-Explorer anzeigen",
                    addToFavorites: "Zu Favoriten hinzufügen",
                    removeFromFavorites: "Von Favoriten entfernen",
                },
            },
        },
    ];
};
