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
import { applicationSearchSettingsComponent as applicationSearchSettingsComponent } from "./application-search-options-component";
import { defaultUserConfigOptions } from "../common/config/default-user-config-options";
import { ElectronStoreConfigRepository } from "../common/config/electron-store-config-repository";
import { searchEngineSettingsComponent } from "./search-engine-settings-component";
import { settingMenuItemComponent } from "./setting-menu-item-component";
import { settingsLoadingOverlayComponent } from "./settings-loading-overlay-component";
import { generalOptionsComponent as generalSettingsComponent } from "./general-settings-component";
import { appearanceSettingsComponent } from "./appearance-settings-component";
import { userStylesComponent } from "./user-styles-component";
import { AppearanceOptions } from "../common/config/appearance-options";

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

// tslint:disable-next-line:no-unused-expression
new Vue({
    data: {
        config: new ElectronStoreConfigRepository(defaultUserConfigOptions).getConfig(),
    },
    el: "#app",
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.userInputChange, (userInput: string) => {
            ipcRenderer.send(IpcChannels.search, userInput);
        });

        vueEventDispatcher.$on(VueEventChannels.handleExecution, (searchResultIem: SearchResultItem | undefined) => {
            if (searchResultIem !== undefined) {
                ipcRenderer.send(IpcChannels.execute, searchResultIem);
            }
        });

        vueEventDispatcher.$on(VueEventChannels.configUpdated, (config: UserConfigOptions) => {
            this.config = config;
            ipcRenderer.send(IpcChannels.configUpdated, config);
            vueEventDispatcher.$emit(VueEventChannels.loadingStarted);
        });

        ipcRenderer.on(IpcChannels.appearanceOptionsUpdated, (event: Electron.Event, updatedAppearanceOptions: AppearanceOptions) => {
            vueEventDispatcher.$emit(VueEventChannels.appearanceOptionsUpdated, updatedAppearanceOptions);
        });

        ipcRenderer.on(IpcChannels.searchResponse, (event: Electron.Event, searchResults: SearchResultItem[]) => {
            vueEventDispatcher.$emit(VueEventChannels.searchResultsUpdated, searchResults);
        });

        ipcRenderer.on(IpcChannels.executionSucceeded, () => {
            vueEventDispatcher.$emit(VueEventChannels.executionSucceeded);
        });

        ipcRenderer.on(IpcChannels.mainWindowHasBeenShown, () => {
            vueEventDispatcher.$emit(VueEventChannels.mainWindowHasBeenShown);
        });
    },
    methods: {
        onKeypress(event: KeyboardEvent) {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "r") {
                ipcRenderer.send(IpcChannels.reloadApp);
            }
        },
    },
});
