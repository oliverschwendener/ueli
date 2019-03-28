export interface TranslationSet {
    trayIconShow: string;
    trayIconSettings: string;
    trayIconQuit: string;

    noSearchResultsFoundTitle: string;
    noSearchResultsFoundDescription: string;

    ueliCommandExitDescription: string;
    ueliCommandExit: string;
    ueliCommandReloadDescription: string;
    ueliCommandReload: string;
    ueliCommandEditSettingsFileDescription: string;
    ueliCommandEditSettingsFile: string;
    ueliCommandOpenSettingsDescription: string;
    ueliCommandOpenSettings: string;
    ueliCommandRefreshIndexesDescription: string;
    ueliCommandRefreshIndexes: string;
    ueliCommandClearCachesDescription: string;
    ueliCommandClearCaches: string;

    generalErrorTitle: string;
    generalErrorDescription: string;

    successfullyRefreshedIndexes: string;
    successfullyClearedCaches: string;
    successfullyUpdatedconfig: string;
    successfullyClearedCachesBeforeExit: string;

    // Settings
    generalSettings: string;
    generalSettingsLanguage: string;
    generalSettingsAutostartApp: string;
    generalSettingsShowTrayIcon: string;
    generalSettingsClearCachesOnExit: string;
    generalSettingsHotKey: string;
    generalSettingsRescanInterval: string;
    generalSettingsShowAlwaysOnPrimaryDisplay: string;

    appearanceSettings: string;
    appearanceSettingsWindowWidth: string;
    appearanceSettingsMaxSearchResultsPerPage: string;
    appearanceSettingsSearchResultHeight: string;
    appearanceSettingsSmoothScrolling: string;
    appearanceSettingsUserInputHeight: string;
    appearanceSettingsShowDescriptionOnAllSearchResults: string;

    colorThemeSettings: string;
    colorthemeUserInputBackgroundColor: string;
    colorThemeUserInputTextColor: string;
    colorThemeSearchResultsBackgroundColor: string;
    colorThemeSearchResultsItemActiveBackgroundColor: string;
    colorThemeSearchResultsItemActiveTextColor: string;
    colorThemeSearchResutlsItemNameTextColor: string;
    colorThemeSearchResultsItemDescriptionTextColor: string;
    colorThemeScrollbarForegroundColor: string;
    colorThemeScrollbarBackgroundColor: string;

    colorPicker: string;

    applicationSearchSettings: string;
    applicationSearchSettingsApplicationFolders: string;
    applicationSearchSettingsApplicationFolder: string;
    applicationSearchSettingsFolderPath: string;
    applicationSearchSettingsRemoveAction: string;
    applicationSearchSettingsAddApplicationFolder: string;
    applicationSearchSettingsApplicationFileExtensions: string;
    applicationSearchSettingsApplicationFileExtension: string;
    applicationSearchSettingsAddApplicationFileExtension: string;
    applicationSearchSettingsDisabled: string;
    applicationSearchSettingsInvalidFileExtensionErrorMessage: string;
    applicationSearchSettingsNotAFolderErrorMessage: string;
    applicationSearchSettingsDoesNotExistErrorMessage: string;
    applicationSearchSettingsFolderValidationError: string;

    searchEngineSettings: string;
    searchEngineSettingsFuzzyness: string;
    searchEngineSettingsFuzzynessDescription: string;
    searchEngineSettingsStrict: string;
    searchEngineSettingsFuzzy: string;
    searchEngineSettingsMaxSearchResults: string;

    shortcutSettings: string;
    shortcutSettingsShortcut: string;
    shortcutSettingsTableType: string;
    shortcutSettingsTableName: string;
    shortcutSettingsTableExecutionArgument: string;
    shortcutSettingsTableDescription: string;
    shortcutSettingsTableTags: string;
    shortcutSettingsTableIcon: string;
    shortcutSettingsTableEdit: string;
    shortcutSettingsTableDelete: string;
    shortcutSettingsAddShortcut: string;
    shortcutSettingsDisabled: string;
    shortcutSettingsEditModalImageUrl: string;
    shortcutSettingsEditModalSvgString: string;
    shortcutSettingsEditModalGoogleWebsite: string;
    shortcutSettingsEditModalDownloadsFolder: string;
    shortcutSettingsEditModalFilePath: string;
    shortcutSettingsInvalidShortcutErrorMessage: string;
    shortcutSettingsTagPlaceholder: string;
    shortcutSettingsTypeUrl: string;
    shortcutSettingsTypeFilePath: string;

    translationSettingsTranslation: string;
    translationSettingsDebounceDelay: string;
    translationSettingsMinSearchTermLength: string;
    translationSettingsPrefix: string;
    translationSettingsSourceLanguage: string;
    translationSettingsTargetLanguage: string;
    translationSettingsDisabled: string;

    everythingSearch: string;
    everythingSearchPathToBinary: string;
    everythingSearchPrefix: string;
    everythingSearchMaxSearchResults: string;
    everythingSearchDisabled: string;
    everythingSearchPathToBinaryFilterName: string;

    mdfindSearch: string;
    mdfindSearchDebounceDelay: string;
    mdfindSearchPrefix: string;
    mdfindSearchMaxSearchResults: string;
    mdfindSearchDisabled: string;

    websearch: string;
    websearchEngines: string;
    websearchEditingModalTitleAdd: string;
    websearchEditingModalTitleEdit: string;
    websearchName: string;
    websearchPrefix: string;
    websearchUrl: string;
    websearchIcon: string;
    websearchPriority: string;
    websearchIsFallback: string;
    websearchEncodeSearchTerm: string;
    websearchInvalidWebsearchEngine: string;
    websearchDisabled: string;

    fileBrowser: string;
    fileBrowserSettingsMaxSearchResults: string;
    fileBrowserOptionsShowHiddenFiles: string;
    fileBrowserOptionsBlackList: string;
    fileBrowserDisabled: string;

    cancel: string;
    save: string;
    add: string;
    remove: string;
    edit: string;
    forExample: string;
    iconType: string;
}
