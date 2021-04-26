import Vue from "vue";
import { VueEventChannels } from "./vue-event-channels";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { userInputComponent } from "./user-input-component";
import { searchResultsComponent } from "./search-results-component";
import { ipcRenderer } from "electron";
import { IpcChannels } from "../common/ipc-channels";
import { SearchResultItem } from "../common/search-result-item";
import { settingsComponent } from "./settings/settings-component";
import { UserConfigOptions } from "../common/config/user-config-options";
import { applicationSearchSettingsComponent } from "./settings/application-search-settings-component";
import { defaultUserConfigOptions } from "../common/config/user-config-options";
import { ElectronStoreConfigRepository } from "../common/config/electron-store-config-repository";
import { searchEngineSettingsComponent } from "./settings/search-engine-settings-component";
import { settingMenuItemComponent } from "./settings/setting-menu-item-component";
import { settingsLoadingOverlayComponent } from "./settings/settings-loading-overlay-component";
import { generalSettingsComponent } from "./settings/general-settings-component";
import { appearanceSettingsComponent } from "./settings/appearance-settings-component";
import { userStylesComponent } from "./user-styles-component";
import { AppearanceOptions } from "../common/config/appearance-options";
import { shortcutSettingsComponent } from "./settings/shortcut-settings-component";
import { shortcutEditingModal } from "./settings/modals/shortcut-editing-modal-component";
import { newApplicationFolderModalComponent } from "./settings/modals/new-application-folder-modal-component";
import { newApplicationFileExtensionModalComponent } from "./settings/modals/new-application-fileextension-modal-component";
import { mdfindSettingsComponent } from "./settings/mdfind-settings-component";
import { translationSettingsComponent } from "./settings/translation-settings-component";
import { getTranslationSet } from "../common/translation/translation-set-manager";
import { everythingSettingsComponent } from "./settings/everything-settings-component";
import { webSearchSettingsComponent } from "./settings/websearch-settings-component";
import { iconComponent } from "./settings/icon-component";
import { websearchEditingModal } from "./settings/modals/websearch-editing-modal-component";
import { iconEditingComponent } from "./settings/icon-editing-component";
import { colorThemeSettingsComponent } from "./settings/color-theme-settings-component";
import { ColorThemeOptions } from "../common/config/color-theme-options";
import { colorPickerComponent } from "./settings/color-picker-component";
import { Chrome } from "vue-color";
import { fileBrowserSettingsComponent } from "./settings/filebrowser-settings-component";
import { operatingSystemCommandsSettingsComponent } from "./settings/operating-system-commands-settings-component";
import { calculatorSettingsComponent } from "./settings/calculator-settings-component";
import { urlSettingsComponent } from "./settings/url-settings-component";
import { emailSettingsComponent } from "./settings/email-settings-component";
import { NotificationType } from "../common/notification-type";
import { currencyConverterSettingsComponent } from "./settings/currency-converter-settings-component";
import { workflowSettingsComponent } from "./settings/workflow-settings-component";
import { workflowEditingModal } from "./settings/modals/workflow-editing-modal-component";
import { commandlineSettingsComponent } from "./settings/commandline-settings-component";
import { tagsEditingComponent } from "./settings/tags-editing-component";
import { TranslationSet } from "../common/translation/translation-set";
import { simpleFolderSearchSettingsComponent } from "./settings/simple-folder-search-settings-component";
import { GeneralOptions } from "../common/config/general-options";
import { simpleFolderSearchEditingModalComponent } from "./settings/modals/simple-folder-search-editing-modal-component";
import { operatingSystemSettingsSettingsComponent } from "./settings/operating-system-settings-settings-component";
import { userConfirmationDialog } from "./settings/modals/user-confirmation-component";
import { UpdateCheckResult } from "../common/update-check-result";
import { uwpSettingsComponent } from "./settings/uwp-settings-component";
import { colorConverterSettingsComponent } from "./settings/color-converter-settings-component";
import { pluginToggle } from "./settings/elements/plugin-toggle";
import { deepCopy } from "../common/helpers/object-helpers";
import { PluginType } from "../main/plugin-type";
import { dictionarySettingsComponent } from "./settings/dictionary-settings-component";
import { browserBookmarkSettingsComponent } from "./settings/browser-bookmark-settings-component";
import { controlPanelSettingsComponent } from "./settings/control-panel-settings-component";

Vue.component("user-input", userInputComponent);
Vue.component("search-results", searchResultsComponent);
Vue.component("settings", settingsComponent);
Vue.component("general-settings", generalSettingsComponent);
Vue.component("appearance-settings", appearanceSettingsComponent);
Vue.component("search-engine-settings", searchEngineSettingsComponent);
Vue.component("application-search-settings", applicationSearchSettingsComponent);
Vue.component("setting-menu-item", settingMenuItemComponent);
Vue.component("settings-loading-overlay", settingsLoadingOverlayComponent);
Vue.component("user-styles", userStylesComponent);
Vue.component("shortcut-settings", shortcutSettingsComponent);
Vue.component("shortcut-editing-modal", shortcutEditingModal);
Vue.component("tags-editing", tagsEditingComponent);
Vue.component("new-application-folder-modal", newApplicationFolderModalComponent);
Vue.component("new-application-file-extension-modal", newApplicationFileExtensionModalComponent);
Vue.component("mdfind-settings", mdfindSettingsComponent);
Vue.component("everthing-settings", everythingSettingsComponent);
Vue.component("translation-settings", translationSettingsComponent);
Vue.component("websearch-settings", webSearchSettingsComponent);
Vue.component("websearch-editing-modal", websearchEditingModal);
Vue.component("icon", iconComponent);
Vue.component("icon-editing", iconEditingComponent);
Vue.component("color-theme-settings", colorThemeSettingsComponent);
Vue.component("chrome-picker", Chrome);
Vue.component("color-picker", colorPickerComponent);
Vue.component("filebrowser-settings", fileBrowserSettingsComponent);
Vue.component("operating-system-commands-settings", operatingSystemCommandsSettingsComponent);
Vue.component("operating-system-settings-settings", operatingSystemSettingsSettingsComponent);
Vue.component("calculator-settings", calculatorSettingsComponent);
Vue.component("dictionary-settings", dictionarySettingsComponent);
Vue.component("url-settings", urlSettingsComponent);
Vue.component("email-settings", emailSettingsComponent);
Vue.component("currency-converter-settings", currencyConverterSettingsComponent);
Vue.component("workflow-settings", workflowSettingsComponent);
Vue.component("workflow-editing-modal", workflowEditingModal);
Vue.component("commandline-settings", commandlineSettingsComponent);
Vue.component("simple-folder-search-settings", simpleFolderSearchSettingsComponent);
Vue.component("simple-folder-search-editing", simpleFolderSearchEditingModalComponent);
Vue.component("user-confirmation", userConfirmationDialog);
Vue.component("uwp-settings", uwpSettingsComponent);
Vue.component("color-converter-setttings", colorConverterSettingsComponent);
Vue.component("plugin-toggle", pluginToggle);
Vue.component("browser-bookmark-settings", browserBookmarkSettingsComponent);
Vue.component("control-panel-settings", controlPanelSettingsComponent);

const initialConfig = new ElectronStoreConfigRepository(deepCopy(defaultUserConfigOptions)).getConfig();

const app = new Vue({
    data: {
        config: initialConfig,
        translations: getTranslationSet(initialConfig.generalOptions.language),
    },
    el: "#app",
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.userInputChange, (userInput: string) => {
            ipcRenderer.send(IpcChannels.search, userInput);
        });

        vueEventDispatcher.$on(
            VueEventChannels.handleExecution,
            (userInput: string, searchResultIem: SearchResultItem | undefined, privileged: boolean) => {
                if (searchResultIem !== undefined) {
                    ipcRenderer.send(IpcChannels.execute, userInput, searchResultIem, privileged);
                }
            },
        );

        vueEventDispatcher.$on(
            VueEventChannels.handleOpenLocation,
            (searchResultItem: SearchResultItem | undefined) => {
                if (searchResultItem !== undefined) {
                    ipcRenderer.send(IpcChannels.openSearchResultLocation, searchResultItem);
                }
            },
        );

        vueEventDispatcher.$on(
            VueEventChannels.handleAutoCompletion,
            (searchResultItem: SearchResultItem | undefined) => {
                if (searchResultItem !== undefined) {
                    ipcRenderer.send(IpcChannels.autoComplete, searchResultItem);
                }
            },
        );

        vueEventDispatcher.$on(VueEventChannels.favoritesRequested, () => {
            ipcRenderer.send(IpcChannels.favoritesRequested);
        });

        vueEventDispatcher.$on(
            VueEventChannels.configUpdated,
            (updatedConfig: UserConfigOptions, needsIndexRefresh?: boolean, pluginType?: PluginType) => {
                if (needsIndexRefresh) {
                    vueEventDispatcher.$emit(VueEventChannels.refreshIndexesStarted);
                }

                this.translations = getTranslationSet(updatedConfig.generalOptions.language);
                this.config = updatedConfig;
                ipcRenderer.send(IpcChannels.configUpdated, updatedConfig, needsIndexRefresh, pluginType);
            },
        );

        vueEventDispatcher.$on(VueEventChannels.clearExecutionLogConfirmed, () => {
            ipcRenderer.send(IpcChannels.clearExecutionLogConfirmed);
        });

        vueEventDispatcher.$on(VueEventChannels.openDebugLogRequested, () => {
            ipcRenderer.send(IpcChannels.openDebugLogRequested);
        });

        vueEventDispatcher.$on(VueEventChannels.openTempFolderRequested, () => {
            ipcRenderer.send(IpcChannels.openTempFolderRequested);
        });

        vueEventDispatcher.$on(VueEventChannels.selectInputHistoryItem, (direction: string) => {
            ipcRenderer.send(IpcChannels.selectInputHistoryItem, direction);
        });

        vueEventDispatcher.$on(VueEventChannels.checkForUpdate, () => {
            ipcRenderer.send(IpcChannels.checkForUpdate);
        });

        vueEventDispatcher.$on(VueEventChannels.downloadUpdate, () => {
            ipcRenderer.send(IpcChannels.downloadUpdate);
        });

        ipcRenderer.on(IpcChannels.executionFinished, (event) => {
            vueEventDispatcher.$emit(VueEventChannels.executionFinished);
        });

        ipcRenderer.on(
            IpcChannels.appearanceOptionsUpdated,
            (event: Electron.Event, updatedAppearanceOptions: AppearanceOptions) => {
                vueEventDispatcher.$emit(VueEventChannels.appearanceOptionsUpdated, updatedAppearanceOptions);
            },
        );

        ipcRenderer.on(
            IpcChannels.generalOptionsUpdated,
            (event: Electron.Event, updatedGeneralOptions: GeneralOptions) => {
                vueEventDispatcher.$emit(VueEventChannels.generalOptionsUpdated, updatedGeneralOptions);
            },
        );

        ipcRenderer.on(IpcChannels.languageUpdated, (event: Electron.Event, updatedTranslationSet: TranslationSet) => {
            this.translations = updatedTranslationSet;
        });

        ipcRenderer.on(
            IpcChannels.colorThemeOptionsUpdated,
            (event: Electron.Event, updatedColorThemeOptions: ColorThemeOptions) => {
                vueEventDispatcher.$emit(VueEventChannels.colorThemeOptionsUpdated, updatedColorThemeOptions);
            },
        );

        ipcRenderer.on(IpcChannels.searchResponse, (event: Electron.Event, searchResults: SearchResultItem[]) => {
            vueEventDispatcher.$emit(VueEventChannels.searchResultsUpdated, searchResults);
        });

        ipcRenderer.on(IpcChannels.favoritesReponse, (event: Electron.Event, searchResults: SearchResultItem[]) => {
            vueEventDispatcher.$emit(VueEventChannels.searchResultsUpdated, searchResults);
        });

        ipcRenderer.on(IpcChannels.mainWindowHasBeenHidden, () => {
            vueEventDispatcher.$emit(VueEventChannels.mainWindowHasBeenHidden);
        });

        ipcRenderer.on(IpcChannels.mainWindowHasBeenShown, () => {
            vueEventDispatcher.$emit(VueEventChannels.mainWindowHasBeenShown);
        });

        ipcRenderer.on(
            IpcChannels.userInputUpdated,
            (event: Electron.Event, updatedUserInput: string, selectText?: boolean) => {
                vueEventDispatcher.$emit(VueEventChannels.userInputUpdated, updatedUserInput, selectText);
            },
        );

        ipcRenderer.on(IpcChannels.notification, (event: Electron.Event, message: string, type?: NotificationType) => {
            vueEventDispatcher.$emit(VueEventChannels.notification, message, type);
        });

        ipcRenderer.on(IpcChannels.refreshIndexesStarted, (event: Electron.Event) => {
            vueEventDispatcher.$emit(VueEventChannels.refreshIndexesStarted);
        });

        ipcRenderer.on(IpcChannels.refreshIndexesCompleted, (event: Electron.Event, message: string) => {
            vueEventDispatcher.$emit(VueEventChannels.refreshIndexesFinished);
        });

        ipcRenderer.on(
            IpcChannels.checkForUpdateResponse,
            (event: Electron.Event, updateCheckResult: UpdateCheckResult) => {
                vueEventDispatcher.$emit(VueEventChannels.checkForUpdateResponse, updateCheckResult);
            },
        );

        ipcRenderer.on(IpcChannels.autoCompleteResponse, (event: Electron.Event, updatedUserInput: string) => {
            vueEventDispatcher.$emit(VueEventChannels.autoCompletionResponse, updatedUserInput);
        });
    },
    methods: {
        mainWindowGlobalKeyPress(event: KeyboardEvent) {
            if ((event.ctrlKey && event.key.toLowerCase() === "i") || (event.metaKey && event.key === ",")) {
                ipcRenderer.send(IpcChannels.openSettingsWindow);
            }

            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "l") {
                vueEventDispatcher.$emit(VueEventChannels.focusOnInput);
            }

            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "r") {
                ipcRenderer.send(IpcChannels.reloadApp);
            }

            if (event.key === "Escape") {
                ipcRenderer.send(IpcChannels.mainWindowHideRequested);
            }

            if (event.key === "F5") {
                ipcRenderer.send(IpcChannels.indexRefreshRequested);
            }
        },
    },
});

document.onkeydown = (event: KeyboardEvent) => {
    app.mainWindowGlobalKeyPress(event);
};
