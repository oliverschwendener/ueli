export enum VueEventChannels {
    enterPress = "enter-press",
    tabPress = "tab-press",
    openSearchResultLocationKeyPress = "open-search-result-location-key-press",
    handleOpenLocation = "handle-open-location",
    handleExecution = "handle-execution",
    handleEmptyEnterPress = "handle-empty-enter-press",
    handleAutoCompletion = "handle-auto-completion",
    autoCompletionResponse = "auto-completion-result",
    mainWindowHasBeenHidden = "main-window-has-been-hidden",
    mainWindowHasBeenShown = "main-window-has-been-shown",
    focusOnInput = "focus-on-input",
    userInputChange = "user-input-change",
    userInputUpdated = "user-input-updated",
    userInputHasBeenReset = "user-input-has-been-reset",
    selectNextItem = "select-next-item",
    selectPreviousItem = "select-previous-item",
    searchResultsUpdated = "search-results-updated",
    configUpdated = "config-updated",
    notification = "push-notification",
    showSetting = "show-setting",
    appearanceOptionsUpdated = "user-styles-udpated",
    generalOptionsUpdated = "general-options-updated",
    colorThemeOptionsUpdated = "color-theme-options-updated",
    openShortcutEditingModal = "add-new-shortcut-button-clicked",
    shortcutEdited = "shortcut-edited",
    openNewApplicationFolderModal = "open-new-application-folder-modal",
    applicationFolderAdded = "application-folder-added",
    openNewApplicationFileExtensionModal = "open-new-application-file-extension-modal",
    applicationFileExtensionAdded = "application-file-extension-added",
    languageUpdated = "language-updated",
    openWebSearchEditingModal = "open-websearch-editing-modal",
    websearchEngineEdited = "websearch-engine-edited",
    editColor = "edit-color",
    saveColor = "save-color",
    favoritesRequested = "favorites-requested",
    clearExecutionLogConfirmed = "clear-execution-log-confirmed",
    openWorkflowEditingModal = "open-workflow-editing-modal",
    workflowEdited = "workflow-edited",
    openDebugLogRequested = "open-debug-log-requested",
    openTempFolderRequested = "open-temp-folder-requested",
    selectInputHistoryItem = "select-input-history-item",
    userConfirmationRequested = "user-confirmation-requested",
    openSimpleFolderSearchEditingModal = "open-simple-folder-search-editing-modal",
    simpleFolderSearchOptionSaved = "simple-folder-search-option-saved",
    settingsConfirmation = "settings-confirmation",
    checkForUpdate = "check-for-update",
    checkForUpdateResponse = "check-for-update-response",
    downloadUpdate = "download-update",
    refreshIndexesStarted = "refresh-indexes-started",
    refreshIndexesFinished = "refresh-indexes-finished",
    executionFinished = "execution-finished",
    pageUpPress = "page-up-press",
    pageDownPress = "page-down-press",
}
