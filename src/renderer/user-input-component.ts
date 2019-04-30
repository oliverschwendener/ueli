import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";
import Vue from "vue";
import { AppearanceOptions } from "../common/config/appearance-options";

export const userInputComponent = Vue.extend({
    data() {
        return {
            loadingVisible: false,
            userInput: "",
        };
    },
    methods: {
        onKeyPress(event: KeyboardEvent): void {
            if (event.key === "ArrowUp") {
                event.preventDefault();
                vueEventDispatcher.$emit(VueEventChannels.selectPreviousItem);
            }

            if (event.key === "ArrowDown") {
                event.preventDefault();
                if (event.shiftKey) {
                    vueEventDispatcher.$emit(VueEventChannels.favoritesRequested);
                } else {
                    vueEventDispatcher.$emit(VueEventChannels.selectNextItem);
                }
            }

            if (event.key === "Enter") {
                const privileged = event.shiftKey;
                vueEventDispatcher.$emit(VueEventChannels.enterPress, privileged);
            }

            if (event.key === "Tab") {
                event.preventDefault();
                vueEventDispatcher.$emit(VueEventChannels.tabPress);
            }

            if (event.key.toLowerCase() === "o" && (event.ctrlKey || event.metaKey)) {
                vueEventDispatcher.$emit(VueEventChannels.openSearchResultLocationKeyPress);
            }
        },
        resetUserInput(): void {
            this.userInput = "";
        },
        setFocusOnInput(): void {
            const userInput = document.getElementById("user-input");
            if (userInput !== null) {
                userInput.focus();
            }
        },
    },
    props: ["appearance"],
    mounted() {
        this.setFocusOnInput();

        vueEventDispatcher.$on(VueEventChannels.mainWindowHasBeenHidden, () => {
            this.resetUserInput();
        });

        vueEventDispatcher.$on(VueEventChannels.mainWindowHasBeenShown, () => {
            this.setFocusOnInput();
        });

        vueEventDispatcher.$on(VueEventChannels.userInputChange, () => {
            this.loadingVisible = true;
        });

        vueEventDispatcher.$on(VueEventChannels.userInputUpdated, (updatedUserInput: string) => {
            this.userInput = updatedUserInput;
        });

        vueEventDispatcher.$on(VueEventChannels.searchResultsUpdated, () => {
            this.loadingVisible = false;
        });

        vueEventDispatcher.$on(VueEventChannels.handleExecution, () => {
            this.userInput = "";
        });

        vueEventDispatcher.$on(VueEventChannels.appearanceOptionsUpdated, (updatedAppearanceOptions: AppearanceOptions) => {
            this.appearance = updatedAppearanceOptions;
        });
    },
    template: `
        <div id="user-input" class="user-input">
            <div v-if="appearance.showSearchIcon" class="user-input__search-icon-container">
                <svg class="user-input__search-icon" :class="{ 'is-loading' : loadingVisible }" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
                    <g id="surface1">
                        <path d="M 19 3 C 13.488281 3 9 7.488281 9 13 C 9 15.394531 9.839844 17.589844 11.25 19.3125 L 3.28125 27.28125 L 4.71875 28.71875 L 12.6875 20.75 C 14.410156 22.160156 16.605469 23 19 23 C 24.511719 23 29 18.511719 29 13 C 29 7.488281 24.511719 3 19 3 Z M 19 5 C 23.429688 5 27 8.570313 27 13 C 27 17.429688 23.429688 21 19 21 C 14.570313 21 11 17.429688 11 13 C 11 8.570313 14.570313 5 19 5 Z "></path>
                    </g>
                </svg>
            </div>
            <input autofocus id="user-input" class="user-input__input" type="text" v-model="userInput" @keydown="onKeyPress">
        </div>
        `,
    watch: {
        userInput(val: string) {
            vueEventDispatcher.$emit(VueEventChannels.userInputChange, val);
        },
    },
});
