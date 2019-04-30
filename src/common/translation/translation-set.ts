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
    successfullyClearedExecutionLog: string;

    commandlineSearchResultDescription: string;

    // Settings
    generalSettingsMenuSection: string;
    pluginSettingsMenuSection: string;

    generalSettings: string;
    generalSettingsLanguage: string;
    generalSettingsLogExecution: string;
    generalSettingsAutostartApp: string;
    generalSettingsShowTrayIcon: string;
    generalSettingsClearCachesOnExit: string;
    generalSettingsHotKey: string;
    generalSettingsRescanIntervalEnabled: string;
    generalSettingsRescanInterval: string;
    generalSettingsShowAlwaysOnPrimaryDisplay: string;
    generalSettingsExportSettings: string;
    generalSettingsSuccessfullyExportedSettings: string;
    generalSettingsImportSettings: string;
    generalSettingsImportFileFilterJsonFiles: string;
    generalSettingsImportErrorInvalidConfig: string;
    generalSettingsResetAllSettings: string;
    clearExecutionLog: string;
    openDebugLog: string;

    appearanceSettings: string;
    appearanceSettingsWindowWidth: string;
    appearanceSettingsMaxSearchResultsPerPage: string;
    appearanceSettingsSearchResultHeight: string;
    appearanceSettingsSmoothScrolling: string;
    appearanceSettingsUserInputHeight: string;
    appearanceSettingsShowDescriptionOnAllSearchResults: string;
    appearanceSettingsShowSearchIcon: string;

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
    applicationSearchSettingsDescription: string;
    applicationSearchSettingsApplicationFolders: string;
    applicationSearchSettingsApplicationFolder: string;
    applicationSearchSettingsFolderPath: string;
    applicationSearchSettingsRemoveAction: string;
    applicationSearchSettingsAddApplicationFolder: string;
    applicationSearchSettingsApplicationFileExtensions: string;
    applicationSearchSettingsApplicationFileExtension: string;
    applicationSearchSettingsAddApplicationFileExtension: string;
    applicationSearchSettingsInvalidFileExtensionErrorMessage: string;
    applicationSearchSettingsNotAFolderErrorMessage: string;
    applicationSearchSettingsDoesNotExistErrorMessage: string;
    applicationSearchSettingsFolderValidationError: string;

    searchEngineSettings: string;
    searchEngineSettingsDescription: string;
    searchEngineSettingsFuzzyness: string;
    searchEngineSettingsFuzzynessDescription: string;
    searchEngineSettingsStrict: string;
    searchEngineSettingsFuzzy: string;
    searchEngineSettingsMaxSearchResults: string;

    shortcutSettings: string;
    shortcutSettingsDescription: string;
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
    shortcutSettingsEditModalImageUrl: string;
    shortcutSettingsEditModalSvgString: string;
    shortcutSettingsEditModalGoogleWebsite: string;
    shortcutSettingsEditModalDownloadsFolder: string;
    shortcutSettingsEditModalFilePath: string;
    shortcutSettingsEditModalCommand: string;
    shortcutSettingsInvalidShortcutErrorMessage: string;
    shortcutSettingsTagPlaceholder: string;
    shortcutSettingsTypeUrl: string;
    shortcutSettingsTypeFilePath: string;
    shortcutSettingsTypeCommandlineTool: string;
    shortcutSettingsEditModalCommandLinetoolDescription: string;

    translationSettingsTranslation: string;
    translationSettingsDescription: string;
    translationSettingsDebounceDelay: string;
    translationSettingsMinSearchTermLength: string;
    translationSettingsPrefix: string;
    translationSettingsSourceLanguage: string;
    translationSettingsTargetLanguage: string;

    everythingSearch: string;
    everythingSearchSettingDescription: string;
    everythingSearchPathToBinary: string;
    everythingSearchPrefix: string;
    everythingSearchMaxSearchResults: string;
    everythingSearchPathToBinaryFilterName: string;

    mdfindSearch: string;
    mdfindSettingsDescription: string;
    mdfindSearchDebounceDelay: string;
    mdfindSearchPrefix: string;
    mdfindSearchMaxSearchResults: string;

    websearch: string;
    websearchSettingDescription: string;
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
    websearchDescription: string;

    fileBrowser: string;
    fileBrowserSettingsDescription: string;
    fileBrowserSettingsMaxSearchResults: string;
    fileBrowserOptionsShowHiddenFiles: string;
    fileBrowserOptionsBlackList: string;
    fileBrowserOptionsBlackListPlaceholder: string;

    operatingSystemCommands: string;
    operatingSystemCommandsSettingsDescription: string;

    macOsShutdown: string;
    macOsShutdownDescription: string;
    macOsRestart: string;
    macOsRestartDescription: string;
    macOsLogout: string;
    macOsLogoutDescription: string;
    macOsLock: string;
    macOsLockDescription: string;

    windowsShutdown: string;
    windowsShutdownDescription: string;
    windowsRestart: string;
    windowsRestartDescription: string;
    windowsSignout: string;
    windowsSignoutDescription: string;
    windowsLock: string;
    windowsLockDescription: string;

    calcuator: string;
    calculatorCopyToClipboard: string;
    calculatorDescription: string;
    calculatorPrecision: string;

    openUrlWithBrowser: string;
    url: string;
    urlDescription: string;
    urlDefaultProtocol: string;

    email: string;
    emailSettingsDescription: string;
    openNewMail: string;

    currencyConverter: string;
    currencyConverterDescription: string;
    currencyConverterPrecision: string;
    currencyConverterCopyToClipboard: string;

    commandline: string;
    commandlinePrefix: string;
    commandlineSettingsDescription: string;

    cancel: string;
    save: string;
    add: string;
    remove: string;
    edit: string;
    forExample: string;
    iconType: string;
}
