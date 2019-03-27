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
import { applicationSearchSettingsComponent } from "./settings/application-search-options-component";
import { defaultUserConfigOptions } from "../common/config/default-user-config-options";
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
import { cloneDeep } from "lodash";
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

const initialConfig = new ElectronStoreConfigRepository(cloneDeep(defaultUserConfigOptions)).getConfig();

// tslint:disable-next-line:no-unused-expression
new Vue({
    data: {
        config: initialConfig,
        translations: getTranslationSet(initialConfig.generalOptions.language),
    },
    el: "#app",
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.userInputChange, (userInput: string) => {
            ipcRenderer.send(IpcChannels.search, userInput);
        });

        vueEventDispatcher.$on(VueEventChannels.handleExecution, (searchResultIem: SearchResultItem | undefined, privileged: boolean) => {
            if (searchResultIem !== undefined) {
                ipcRenderer.send(IpcChannels.execute, searchResultIem, privileged);
            }
        });

        vueEventDispatcher.$on(VueEventChannels.handleOpenLocation, (searchResultItem: SearchResultItem | undefined) => {
            if (searchResultItem !== undefined) {
                ipcRenderer.send(IpcChannels.openSearchResultLocation, searchResultItem);
            }
        });

        vueEventDispatcher.$on(VueEventChannels.handleAutoCompletion, (searchResultItem: SearchResultItem | undefined) => {
            if (searchResultItem !== undefined) {
                ipcRenderer.send(IpcChannels.autoComplete, searchResultItem);
            }
        });

        vueEventDispatcher.$on(VueEventChannels.configUpdated, (config: UserConfigOptions, needsIndexRefresh: boolean) => {
            this.translations = getTranslationSet(config.generalOptions.language);
            this.config = config;
            ipcRenderer.send(IpcChannels.configUpdated, config, needsIndexRefresh);
            vueEventDispatcher.$emit(VueEventChannels.loadingStarted);
        });

        ipcRenderer.on(IpcChannels.appearanceOptionsUpdated, (event: Electron.Event, updatedAppearanceOptions: AppearanceOptions) => {
            vueEventDispatcher.$emit(VueEventChannels.appearanceOptionsUpdated, updatedAppearanceOptions);
        });

        ipcRenderer.on(IpcChannels.colorThemeOptionsUpdated, (event: Electron.Event, updatedColorThemeOptions: ColorThemeOptions) => {
            vueEventDispatcher.$emit(VueEventChannels.colorThemeOptionsUpdated, updatedColorThemeOptions);
        });

        ipcRenderer.on(IpcChannels.searchResponse, (event: Electron.Event, searchResults: SearchResultItem[]) => {
            vueEventDispatcher.$emit(VueEventChannels.searchResultsUpdated, searchResults);
        });

        ipcRenderer.on(IpcChannels.mainWindowHasBeenHidden, () => {
            vueEventDispatcher.$emit(VueEventChannels.mainWindowHasBeenHidden);
        });

        ipcRenderer.on(IpcChannels.mainWindowHasBeenShown, () => {
            vueEventDispatcher.$emit(VueEventChannels.mainWindowHasBeenShown);
        });

        ipcRenderer.on(IpcChannels.userInputUpdated, (event: Electron.Event, updatedUserInput: string) => {
            vueEventDispatcher.$emit(VueEventChannels.userInputUpdated, updatedUserInput);
        });
    },
    methods: {
        mainGlobalKeyPress(event: KeyboardEvent) {
            if ((event.ctrlKey && event.key.toLowerCase() === "i") || (event.metaKey && event.key === ",")) {
                ipcRenderer.send(IpcChannels.openSettingsWindow);
            }
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "r") {
                ipcRenderer.send(IpcChannels.reloadApp);
            }
        },
        settingsGlobalKeyPress(event: KeyboardEvent) {
            //
        },
    },
});
