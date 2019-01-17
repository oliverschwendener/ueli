import Vue from "vue";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";
import { AppearanceOptions } from "../common/config/appearance-options";

export const userStylesComponent = Vue.extend({
    props: ["config"],
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.appearanceOptionsUpdated, (updatedAppearanceOptions: AppearanceOptions) => {
            this.config = updatedAppearanceOptions;
        });
    },
    template: `<style>
        :root {
            --user-input--height: {{ config.userInputHeight }}px;
            --search-results--item-height: {{ config.searchResultHeight }}px;
        }
    </style>`,
});
