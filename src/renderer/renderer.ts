import Vue from "vue";
import { VueEventChannels } from "./vue-event-channels";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { userInputComponent } from "./user-input-component";
import { searchResultsComponent } from "./search-results-component";
import { ipcRenderer } from "electron";
import { IpcChannels } from "../common/ipc-channels";
import { SearchResultItem } from "../common/search-result-item";

Vue.component("user-input", userInputComponent);
Vue.component("search-results", searchResultsComponent);

// tslint:disable-next-line:no-unused-expression
new Vue({
    data: {
        message: "hello",
    },
    el: "#app",
});

vueEventDispatcher.$on(VueEventChannels.userInputChange, (userInput: string) => {
    ipcRenderer.send(IpcChannels.search, userInput);
});

ipcRenderer.on(IpcChannels.searchResponse, (event: Electron.Event, searchResults: SearchResultItem[]) => {
    vueEventDispatcher.$emit(VueEventChannels.searchResultsUpdated, searchResults);
});
