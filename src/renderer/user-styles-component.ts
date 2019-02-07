import Vue from "vue";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";
import { AppearanceOptions } from "../common/config/appearance-options";

export const userStylesComponent = Vue.extend({
    props: ["appearance"],
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.appearanceOptionsUpdated, (updatedAppearanceOptions: AppearanceOptions) => {
            this.appearance = updatedAppearanceOptions;
        });
    },
    template: `<style>
        :root {
            --user-input--height: {{ appearance.userInputHeight }}px;
            --search-results--item-height: {{ appearance.searchResultHeight }}px;
        }
    </style>`,
});
