export interface TranslationSet {
    trayIconShow: string;
    trayIconSettings: string;
    trayIconQuit: string;

    userConfirmationProceed: string;

    noSearchResultsFoundTitle: string;
    noSearchResultsFoundDescription: string;

    refreshingIndexesPending: string;

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
    successfullyClearedExecutionLog: string;

    commandlineSearchResultDescription: string;

    noFavoritesFoundDescription: string;
    noFavoritesFoundTitle: string;

    // Settings
    settings: string;

    generalSettingsMenuSection: string;
    pluginSettingsMenuSection: string;

    generalSettings: string;
    generalSettingsLanguage: string;
    generalSettingsLogExecution: string;
    generalSettingsPersistentUserInput: string;
    generalSettingsAutostartApp: string;
    generalSettingsShowTrayIcon: string;
    generalSettingsClearCachesOnExit: string;
    generalSettingsHotKey: string;
    generalSettingsRescanIntervalEnabled: string;
    generalSettingsRescanInterval: string;
    generalSettingsShowAlwaysOnPrimaryDisplay: string;
    generalSettingsRememberWindowPosition: string;
    generalSettingsExportSettings: string;
    generalSettingsSuccessfullyExportedSettings: string;
    generalSettingsImportSettings: string;
    generalSettingsImportFileFilterJsonFiles: string;
    generalSettingsImportErrorInvalidConfig: string;
    generalSettingsResetAllSettings: string;
    generalSettingsResetWarning: string;
    generalSettingsResetAllSettingsWarning: string;
    generalSettingsClearExecutionLogWarning: string;
    generalSettingsHideMainWindowAfterExecution: string;
    generalSettingsHideMainWindowOnBlur: string;
    generalSettingsDecimalSeparator: string;
    generalSettingsCheckingForUpdate: string;
    generalSettingsDownloadUpdate: string;
    generalSettingsDownloadingUpdate: string;
    generalSettingsLatestVersion: string;
    generalSettingsErrorWhileCheckingForUpdate: string;
    clearExecutionLog: string;
    openDebugLog: string;
    openTempFolder: string;

    hotkeyKeyBackspace: string;
    hotkeyKeyDelete: string;
    hotkeyKeyDown: string;
    hotkeyKeyEnd: string;
    hotkeyKeyEscape: string;
    hotkeyKeyHome: string;
    hotkeyKeyInsert: string;
    hotkeyKeyLeft: string;
    hotkeyKeyPageDown: string;
    hotkeyKeyPageUp: string;
    hotkeyKeyPlus: string;
    hotkeyKeyReturn: string;
    hotkeyKeyRight: string;
    hotkeyKeySpace: string;
    hotkeyKeyTab: string;
    hotkeyKeyUp: string;
    hotkeyModifierAlt: string;
    hotkeyModifierAltGr: string;
    hotkeyModifierCommand: string;
    hotkeyModifierControl: string;
    hotkeyModifierOption: string;
    hotkeyModifierShift: string;
    hotkeyModifierSuper: string;

    appearanceSettings: string;
    appearanceSettingsWindowWidth: string;
    appearanceSettingsMaxSearchResultsPerPage: string;
    appearanceSettingsSearchResultHeight: string;
    appearanceSettingsSmoothScrolling: string;
    appearanceSettingsUserInputHeight: string;
    appearanceSettingsShowDescriptionOnAllSearchResults: string;
    appearanceSettingsShowSearchIcon: string;
    appearanceSettingsShowSearchResultNumbers: string;
    appearanceSettingsResetWarningMessage: string;
    appearanceSettingsAllowTransparentBackground: string;
    appearanceSettingsFontFamily: string;
    appearanceSettingsUserInputBorderRadius: string;
    appearanceSettingsUserInputBottomMargin: string;
    appearanceSettingsSearchResultsBorderRadius: string;
    appearanceSettingsScrollbarBorderRadius: string;
    appearanceSettingsBorderRadiusDescription: string;

    settingsUserInputTitle: string;
    settingsSearchResultsBoxTitle: string;
    settingsScrollbarTitle: string;
    settingsGeneralTitle: string;

    colorThemeSettings: string;
    colorThemeSettingsImportColorTheme: string;
    colorThemeSettingsExportColorTheme: string;
    colorThemeSettingsResetWarning: string;
    colorThemeExportSucceeded: string;
    colorThemeExportFailed: string;
    colorThemeImportSucceeded: string;
    colorThemeImportFailed: string;
    colorThemeInvalidColorTheme: string;
    colorThemePresets: string;
    colorthemeUserInputBackgroundColor: string;
    colorThemeUserInputTextColor: string;
    colorThemeSearchResultsBackgroundColor: string;
    colorThemeSearchResultsItemActiveBackgroundColor: string;
    colorThemeSearchResultsItemActiveTextColor: string;
    colorThemeSearchResultsItemActiveDescriptionColor: string;
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
    applicationSearchSettingsUseNativeIcons: string;

    searchEngineSettings: string;
    searchEngineSettingsDescription: string;
    searchEngineSettingsFuzzyness: string;
    searchEngineSettingsFuzzynessDescription: string;
    searchEngineSettingsStrict: string;
    searchEngineSettingsFuzzy: string;
    searchEngineSettingsBlacklist: string;
    searchEngineSettingsMaxSearchResults: string;
    searchEngineSettingsResetWarning: string;

    shortcutSettings: string;
    shortcutSettingsDescription: string;
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
    shortcutSettingsEditModalColor: string;
    shortcutSettingsEditModalGoogleWebsite: string;
    shortcutSettingsEditModalDownloadsFolder: string;
    shortcutSettingsEditModalCommand: string;
    shortcutSettingsInvalidShortcutErrorMessage: string;
    shortcutSettingsTagPlaceholder: string;
    shortcutSettingsTypeUrl: string;
    shortcutSettingsTypeCommandlineTool: string;
    shortcutSettingsEditModalCommandLinetoolDescription: string;
    shortcutSettingsNeedsUserConfirmation: string;

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
    websearchSuggestionUrl: string;
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

    operatingSystemSettings: string;
    operatingSystemSettingsSettingsDescription: string;

    macOsShutdown: string;
    macOsShutdownDescription: string;
    macOsRestart: string;
    macOsRestartDescription: string;
    macOsLogout: string;
    macOsLogoutDescription: string;
    macOsSleep: string;
    macOsSleepDescription: string;
    macOsLock: string;
    macOsLockDescription: string;

    windowsShutdown: string;
    windowsShutdownDescription: string;
    windowsRestart: string;
    windowsRestartDescription: string;
    windowsReboot: string;
    windowsSignout: string;
    windowsSignoutDescription: string;
    windowsLock: string;
    windowsLockDescription: string;
    windowsSleep: string;
    windowsSleepDescription: string;
    windowsHibernation: string;
    windowsHibernationDescription: string;

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

    workflows: string;
    workflowSettingsDescription: string;
    workflowSettingsAddWorkflow: string;
    workflowName: string;
    workflowNamePlaceholder: string;
    workflowDescription: string;
    workflowDescriptionPlaceholder: string;
    workflowTags: string;
    workflowIcon: string;
    workflowExecutionSteps: string;
    workflowExecutionArgumentType: string;
    workflowExecutionArgumentTypeCommandlineTool: string;
    workflowExecutionArgumentTypeUrl: string;
    workflowInvalidExecutionStep: string;
    workflowInvalidWorkflow: string;
    workflowNeedsUserConfirmationBeforeExecution: string;

    commandline: string;
    commandlinePrefix: string;
    commandlineSettingsDescription: string;
    commandlineShell: string;

    simpleFolderSearch: string;
    simpleFolderSearchDescription: string;
    simpleFolderSearchRecursive: string;
    simpleFolderSearchExcludeHiddenFiles: string;
    simpleFolderSearchFolderPath: string;
    simpleFolderSearchAddFolder: string;
    simpleFolderSearchEditFolder: string;

    uwpSettingsDescription: string;

    colorConverter: string;
    colorConverterDescription: string;
    colorConverterShowColorPreview: string;

    dictionary: string;
    dictionaryDescription: string;
    dictionaryPrefix: string;
    dictionaryMinSearchTermLength: string;
    dictionaryDebounceDelay: string;

    browserBookmarks: string;
    browserBookmarksBrowser: string;
    browserBookmarksDescription: string;
    browserBookmarksUseFavicons: string;
    browserBookmark: string;

    cancel: string;
    save: string;
    add: string;
    remove: string;
    edit: string;
    forExample: string;
    example: string;
    iconType: string;
    iconTypeColor: string;
    showFullFilePath: string;
    yes: string;
    no: string;
    resetToDefault: string;
    resetPluginSettingsToDefaultWarning: string;
    filePath: string;
    folderPath: string;
    chooseFile: string;
    chooseFolder: string;
    restartRequired: string;

    controlPanel: string;
    controlPanelSettingsDescription: string;
}
