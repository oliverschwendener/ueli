import { UeliHelpers } from "./helpers/ueli-helpers";

export class IpcChannels {
    public static readonly hideWindow = "hide-window";
    public static readonly execute = "execute";
    public static readonly getSearch = "get-search";
    public static readonly getSearchResponse = "get-search-response";
    public static readonly openFileLocation = "open-file-location";
    public static readonly getSearchIcon = "get-search-icon";
    public static readonly getSearchIconResponse = "get-search-icon-response";
    public static readonly autoComplete = "auto-complete";
    public static readonly autoCompleteResponse = "auto-complete-response";
    public static readonly commandLineExecution = "command-line-execution";
    public static readonly commandLineOutput = "command-line-output";
    public static readonly ueliReload = `${UeliHelpers.ueliCommandPrefix}reload`;
    public static readonly ueliExit = `${UeliHelpers.ueliCommandPrefix}exit`;
    public static readonly ueliCheckForUpdates = `${UeliHelpers.ueliCommandPrefix}check-for-updates`;
    public static readonly ueliUpdateUeli = `${UeliHelpers.ueliCommandPrefix}update`;
    public static readonly ueliUpdateWasFound = "update-was-found";
    public static readonly ueliNoUpdateWasFound = "no-update-was-found";
    public static readonly ueliUpdateCheckError = "ueli-update-check-error";
    public static readonly exitCommandLineTool = "exit-command-line-tool";
    public static readonly resetCommandlineOutput = "reset-commandline-output";
    public static readonly resetUserInput = "reset-user-input";
    public static readonly showSettingsFromMain = `${UeliHelpers.ueliCommandPrefix}show-settings-from-main`;
    public static readonly showSettingsFromRenderer = "show-settings-from-renderer";
    public static readonly hideSettings = "hide-settings";
    public static readonly updateAppConfig = "update-app-config";
    public static readonly updateUserConfig = "update-user-config";
    public static readonly getIndexLength = "get-index-length";
    public static readonly getIndexLengthResponse = "get-index-length-reponse";
    public static readonly appReloaded = "app-reloaded";
}
