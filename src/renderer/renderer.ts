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
import { applicationSearchOptionsComponent } from "./application-search-options-component";
import { defaultUserConfigOptions } from "../common/config/default-user-config-options";

Vue.component("user-input", userInputComponent);
Vue.component("search-results", searchResultsComponent);
Vue.component("settings", settingsComponent);
Vue.component("application-search-settings", applicationSearchOptionsComponent);

// tslint:disable-next-line:no-unused-expression
new Vue({
    data: {
        config: defaultUserConfigOptions,
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
