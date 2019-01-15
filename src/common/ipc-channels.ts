export enum IpcChannels {
    search = "search",
    searchResponse = "search-response",
    execute = "execute",
    executionSucceeded = "executed-succeeded",
    mainWindowHasBeenShown = "main-window-has-been-shown",
    userInputHasBeenResetAndMainWindowCanBeHidden = "user-input-has-been-reset-and-main-window-can-be-hidden",
    reloadApp = "reload-app",
    openSettingsWindow = "open-settings-window",
    configUpdated = "config-updated",
    indexRefreshSucceeded = "index-refresh-succeeded",
    indexRefreshFailed = "index-refresh-failed",
}
