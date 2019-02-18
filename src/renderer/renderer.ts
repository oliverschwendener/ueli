import Vue from "vue";
import { VueEventChannels } from "./vue-event-channels";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { userInputComponent } from "./user-input-component";
import { searchResultsComponent } from "./search-results-component";
import { ipcRenderer } from "electron";
import { IpcChannels } from "../common/ipc-channels";
import { SearchResultItem } from "../common/search-result-item";
import { settingsComponent } from "./settings-component";
import { UserConfigOptions } from "../common/config/user-config-options";
import { applicationSearchSettingsComponent } from "./application-search-options-component";
import { defaultUserConfigOptions } from "../common/config/default-user-config-options";
import { ElectronStoreConfigRepository } from "../common/config/electron-store-config-repository";
import { searchEngineSettingsComponent } from "./search-engine-settings-component";
import { settingMenuItemComponent } from "./setting-menu-item-component";
import { settingsLoadingOverlayComponent } from "./settings-loading-overlay-component";
import { generalSettingsComponent } from "./general-settings-component";
import { appearanceSettingsComponent } from "./appearance-settings-component";
import { userStylesComponent } from "./user-styles-component";
import { AppearanceOptions } from "../common/config/appearance-options";
import { shortcutSettingsComponent } from "./shortcut-settings-component";
import { shortcutEditingModal } from "./shortcut-editing-modal-component";
import { cloneDeep } from "lodash";
import { newApplicationFolderModalComponent } from "./new-application-folder-modal-component";
import { newApplicationFileExtensionModalComponent } from "./new-application-fileextension-modal-component";
import { mdfindSettingsComponent } from "./mdfind-settings-component";
import { translationSettingsComponent } from "./translation-settings-component";

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
Vue.component("translation-settings", translationSettingsComponent);

// tslint:disable-next-line:no-unused-expression
new Vue({
    data: {
        config: new ElectronStoreConfigRepository(cloneDeep(defaultUserConfigOptions)).getConfig(),
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

        vueEventDispatcher.$on(VueEventChannels.configUpdated, (config: UserConfigOptions, needsIndexRefresh: boolean) => {
            this.config = config;
            ipcRenderer.send(IpcChannels.configUpdated, config, needsIndexRefresh);
            vueEventDispatcher.$emit(VueEventChannels.loadingStarted);
        });

        ipcRenderer.on(IpcChannels.appearanceOptionsUpdated, (event: Electron.Event, updatedAppearanceOptions: AppearanceOptions) => {
            vueEventDispatcher.$emit(VueEventChannels.appearanceOptionsUpdated, updatedAppearanceOptions);
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
