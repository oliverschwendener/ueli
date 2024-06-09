import type { Resources, Translations } from "@common/Core/Translator";

export const getCoreResources = (): { namespace: string; resources: Resources<Translations> }[] => {
    return [
        {
            namespace: "general",
            resources: {
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
            resources: {
                "en-US": {
                    placeholder: "Type to search...",
                    noResultsFoundFor: "No results found for",
                    noResultsFound: "No results found",
                    searchHistory: "Search History",
                },
                "de-CH": {
                    placeholder: "Suchbegriff eingeben...",
                    noResultsFoundFor: "Keine Suchergebnisse gefunden für",
                    noResultsFound: "Keine Suchergebnisse gefunden",
                    searchHistory: "Suchverlauf",
                },
            },
        },
        {
            namespace: "settingsGeneral",
            resources: {
                "en-US": {
                    title: "General",
                    hotkey: "Hotkey",
                    validHotkey: "Valid hotkey",
                    invalidHotkey: "Invalid hotkey",
                    saveHotkey: "Save",
                    hotkeyMoreInfo: "More info",
                    language: "Language",
                    autostart: "Autostart",
                    autostartDescription: "Start Ueli automatically after you log into the computer",
                    searchHistoryEnabled: "Search History",
                    searchHistoryEnabledDescription: "The search history lets you see your previous searches",
                    searchHistoryLimit: "Search History Limit",
                    searchHistoryLimitHint: "Limits the maximum number of search history items",
                },
                "de-CH": {
                    title: "Allgemein",
                    hotkey: "Tastenkombination",
                    validHotkey: "Gültige Tastenkombination",
                    invalidHotkey: "Ungültige Tastenkombination",
                    saveHotkey: "Speichern",
                    hotkeyMoreInfo: "Mehr Informationen",
                    language: "Sprache",
                    autostart: "Autostart",
                    autostartDescription: "Ueli automatisch starten, nach Anmelden am Computer",
                    searchHistoryEnabled: "Suchverlauf",
                    searchHistoryEnabledDescription: "Der Suchverlauf zeigt dir deine vorherigen Suchen",
                    searchHistoryLimit: "Suchverlauf Limit",
                    searchHistoryLimitHint: "Begrenzt die maximale Anzahl an Suchverlaufseinträgen",
                },
            },
        },
        {
            namespace: "settingsAppearance",
            resources: {
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
            resources: {
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
            resources: {
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
            resources: {
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
            resources: {
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
            resources: {
                "en-US": {
                    title: "Search Engine",
                    searchEngine: "Search Engine",
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
                    searchEngine: "Suchmaschine",
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
            resources: {
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
            resources: {
                "en-US": {
                    title: "Window",
                    hideWindowOn: "Hide window on",
                    "hideWindow.placeholder": "Select events",
                    "hideWindowOn.blur": "Blur",
                    "hideWindowOn.afterInvocation": "After invocation",
                    "hideWindowOn.escapePressed": "Pressing escape key",
                    alwaysOnTop: "Always on top",
                    showOnStartup: "Show on startup",
                    alwaysCenter: "Always center window",
                },
                "de-CH": {
                    title: "Fenster",
                    hideWindowOn: "Fenster verstecken bei",
                    "hideWindow.placeholder": "Wähle Ereignisse",
                    "hideWindowOn.blur": "Fokusverlust",
                    "hideWindowOn.afterInvocation": "Nach Ausführung",
                    "hideWindowOn.escapePressed": "Drücken der Escape-Taste",
                    alwaysOnTop: "Immer im Vordergrund",
                    showOnStartup: "Beim Start anzeigen",
                    alwaysCenter: "Fenster immer zentrieren",
                },
            },
        },
        {
            namespace: "searchResultItemAction",
            resources: {
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
