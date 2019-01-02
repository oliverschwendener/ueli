import Vue from "vue";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";
import { SearchResultItem } from "../common/search-result-item";

export const searchResultsComponent = Vue.extend({
    data() {
        return {
            searchResults: [],
        };
    },
    methods: {
        update(s: SearchResultItem[]) {
            this.searchResults = s;
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.searchResultsUpdated, (s: SearchResultItem[]) => {
            this.update(s);
        });
    },
    template: `<ul><li v-for="searchResult in searchResults">{{ searchResult.name }}</li></ul>`,
});
