import Vue from "vue";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";
import { AppearanceOptions } from "../common/config/appearance-options";
import { ColorThemeOptions } from "../common/config/color-theme-options";

export const userStylesComponent = Vue.extend({
    props: ["appearance", "colortheme"],
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.appearanceOptionsUpdated, (updatedAppearanceOptions: AppearanceOptions) => {
            this.appearance = updatedAppearanceOptions;
        });

        vueEventDispatcher.$on(VueEventChannels.colorThemeOptionsUpdated, (updatedColorThemeOptions: ColorThemeOptions) => {
            this.colortheme = updatedColorThemeOptions;
        });
    },
    template: `<style>
        :root {
            --user-input--height: {{ appearance.userInputHeight }}px;
            --search-results--item-height: {{ appearance.searchResultHeight }}px;

            --user-input--background-color: {{ colortheme.userInputBackgroundColor }};
            --user-input--color: {{ colortheme.userInputTextColor }};
            --search-results--background-color: {{ colortheme.searchResultsBackgroundColor }};
            --search-results--item-active-background-color: {{ colortheme.searchResultsItemActiveBackgroundColor }};
            --search-results--item-active-text-color: {{ colortheme.searchResultsItemActiveTextColor }};
            --search-results--item-name-text-color: {{ colortheme.searchResultsItemNameTextcolor }};
            --search-results--item-description-text-color: {{ colortheme.searchResultsItemDescriptionTextColor }};

            --scrollbar--foreground-color: {{ colortheme.scrollbarForegroundColor }};
            --scrollbar--background-color:{{ colortheme.scrollbarBackgroundColor }};
        }
    </style>`,
});
