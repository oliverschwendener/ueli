import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";
import Vue from "vue";
import { showLoaderDelay } from "./renderer-helpers";
import { UserConfigOptions } from "../common/config/user-config-options";
import { AppearanceOptions } from "../common/config/appearance-options";
import { GeneralOptions } from "../common/config/general-options";

export const userInputComponent = Vue.extend({
    data() {
        return {
            executionIsPending: false,
            loadingCompleted: true,
            loadingVisible: false,
            refreshIndexesIsPending: false,
            userConfirmationDialogVisible: false,
            userInput: "",
        };
    },
    computed: {
        userInputDisabled(): boolean {
            return this.executionIsPending;
        },
    },
    methods: {
        keyPress(event: KeyboardEvent) {
            const ctrlOrMeta = event.ctrlKey || event.metaKey;

            if (event.key === "ArrowUp" || (ctrlOrMeta && event.key.toLowerCase() === "p")) {
                event.preventDefault();
                if (event.shiftKey) {
                    vueEventDispatcher.$emit(VueEventChannels.selectInputHistoryItem, "previous");
                } else {
                    vueEventDispatcher.$emit(VueEventChannels.selectPreviousItem);
                }
            }

            if (event.key === "ArrowDown" || (ctrlOrMeta && event.key.toLowerCase() === "n")) {
                event.preventDefault();
                if (event.shiftKey) {
                    vueEventDispatcher.$emit(VueEventChannels.selectInputHistoryItem, "next");
                } else {
                    vueEventDispatcher.$emit(VueEventChannels.selectNextItem);
                }
            }

            if (event.key === "PageUp") {
                event.preventDefault();
                vueEventDispatcher.$emit(VueEventChannels.pageUpPress);
            }

            if (event.key === "PageDown") {
                event.preventDefault();
                vueEventDispatcher.$emit(VueEventChannels.pageDownPress);
            }

            if (event.key.toLowerCase() === "f" && ctrlOrMeta) {
                event.preventDefault();
                vueEventDispatcher.$emit(VueEventChannels.favoritesRequested);
            }

            if (event.key === "Enter") {
                const privileged: boolean = event.shiftKey;
                const userConfirmed: boolean = this.userConfirmationDialogVisible;
                vueEventDispatcher.$emit(VueEventChannels.enterPress, this.userInput, privileged, userConfirmed);
            }

            if (event.key === "Tab") {
                event.preventDefault();
                vueEventDispatcher.$emit(VueEventChannels.tabPress);
            }

            if (event.key.toLowerCase() === "o" && ctrlOrMeta) {
                vueEventDispatcher.$emit(VueEventChannels.openSearchResultLocationKeyPress);
            }
        },
        resetUserInput(): void {
            this.userInput = "";
        },
        setFocusOnInput(): void {
            const $userInput = this.$refs.userInput as HTMLInputElement;
            $userInput.focus();
        },
        selectUserInput(): void {
            this.setFocusOnInput();
            document.execCommand("selectall");
        },
        updateUserInput(updatedUserInput: string, selectText?: boolean) {
            this.userInput = updatedUserInput;

            // delay user input selection because user input update takes a while
            if (selectText) {
                setTimeout(this.selectUserInput, 50);
            }
        },
    },
    props: ["config", "translations"],
    mounted() {
        this.setFocusOnInput();

        vueEventDispatcher.$on(VueEventChannels.mainWindowHasBeenHidden, () => {
            const config: UserConfigOptions = this.config;
            if (!config.generalOptions.persistentUserInput) {
                this.resetUserInput();
            } else {
                this.selectUserInput();
            }
        });

        vueEventDispatcher.$on(VueEventChannels.mainWindowHasBeenShown, () => {
            this.setFocusOnInput();
        });

        vueEventDispatcher.$on(VueEventChannels.focusOnInput, () => {
            this.setFocusOnInput();
        });

        vueEventDispatcher.$on(VueEventChannels.userConfirmationRequested, () => {
            this.userConfirmationDialogVisible = true;
        });

        vueEventDispatcher.$on(VueEventChannels.userInputChange, () => {
            this.loadingCompleted = false;

            // show loader only when loading has not completed within the given time
            setTimeout(() => {
                if (!this.loadingCompleted) {
                    this.loadingVisible = true;
                }
            }, showLoaderDelay);
        });

        vueEventDispatcher.$on(VueEventChannels.userInputUpdated, (updatedUserInput: string, selectText?: boolean) => {
            this.updateUserInput(updatedUserInput, selectText);
        });

        vueEventDispatcher.$on(VueEventChannels.searchResultsUpdated, () => {
            this.loadingCompleted = true;
            this.loadingVisible = false;
        });

        vueEventDispatcher.$on(VueEventChannels.handleExecution, () => {
            this.executionIsPending = true;
            this.loadingCompleted = false;
            this.loadingVisible = true;
        });

        vueEventDispatcher.$on(VueEventChannels.executionFinished, () => {
            this.executionIsPending = false;
            this.loadingCompleted = true;
            this.loadingVisible = false;
            setTimeout(() => this.setFocusOnInput(), 50);
        });

        vueEventDispatcher.$on(
            VueEventChannels.appearanceOptionsUpdated,
            (updatedAppearanceOptions: AppearanceOptions) => {
                const config: UserConfigOptions = this.config;
                config.appearanceOptions = updatedAppearanceOptions;
            },
        );

        vueEventDispatcher.$on(VueEventChannels.generalOptionsUpdated, (updatedGeneralOptions: GeneralOptions) => {
            const config: UserConfigOptions = this.config;
            config.generalOptions = updatedGeneralOptions;
        });

        vueEventDispatcher.$on(VueEventChannels.autoCompletionResponse, (updatedUserInput: string) => {
            this.userInput = updatedUserInput;
        });

        vueEventDispatcher.$on(VueEventChannels.refreshIndexesStarted, () => {
            this.refreshIndexesIsPending = true;
        });

        vueEventDispatcher.$on(VueEventChannels.refreshIndexesFinished, () => {
            this.refreshIndexesIsPending = false;
            setTimeout(this.setFocusOnInput, 50);
        });
    },
    template: `
        <div class="user-input">
            <div v-if="config.appearanceOptions.showSearchIcon" class="user-input__search-icon-container">
                <svg v-if="loadingVisible" class="user-input__search-icon spinning" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                    <path style="line-height:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000;text-transform:none;block-progression:tb;isolation:auto;mix-blend-mode:normal" d="M 25.005859 2.0019531 C 15.493404 2.0019531 7.3305415 7.7905748 3.8339844 16.039062 A 1.0001 1.0001 0 0 0 3.7675781 16.173828 C 3.6837741 16.37569 3.616691 16.580251 3.5390625 16.783203 C 3.434058 17.057243 3.3232142 17.328448 3.2285156 17.607422 C 3.0554711 18.116722 2.8997334 18.628986 2.7636719 19.142578 A 1.0001 1.0001 0 0 0 2.7597656 19.158203 C 2.751634 19.189254 2.7404267 19.218898 2.7324219 19.25 A 1.0004882 1.0004882 0 0 0 4.6699219 19.75 C 4.6736431 19.735542 4.6778894 19.721477 4.6816406 19.707031 C 4.8102764 19.211645 4.9618398 18.726577 5.125 18.246094 C 5.2112418 17.992456 5.311639 17.740453 5.4082031 17.488281 C 8.4305276 9.6077363 16.048971 4.0019531 25.005859 4.0019531 C 36.614403 4.0019531 46.003906 13.391456 46.003906 25 A 1.0001 1.0001 0 1 0 48.003906 25 C 48.003906 12.310544 37.695315 2.0019531 25.005859 2.0019531 z M 2.7089844 24.091797 L 2.0644531 24.714844 L 2.0078125 25.0625 L 2.0234375 26.003906 L 2.0253906 26.033203 L 2.0273438 26.060547 L 2.1191406 27.308594 L 2.1210938 27.337891 L 2.125 27.365234 L 2.2890625 28.603516 L 2.2929688 28.630859 L 2.2988281 28.658203 L 2.5292969 29.882812 L 2.5351562 29.910156 L 2.5429688 29.9375 L 2.7890625 30.929688 L 3.3730469 31.611328 L 4.2675781 31.550781 L 4.7539062 30.798828 L 4.7304688 30.447266 L 4.4882812 29.474609 L 4.2714844 28.341797 L 4.2695312 28.324219 L 4.1132812 27.134766 L 4.0234375 25.929688 L 4.0214844 25.912109 L 4.0078125 25.029297 L 3.59375 24.234375 L 2.7089844 24.091797 z M 6.0527344 34.955078 L 5.2089844 35.261719 L 4.9492188 36.119141 L 5.0703125 36.449219 L 5.4257812 37.064453 L 5.4414062 37.089844 L 5.4550781 37.113281 L 6.1386719 38.152344 L 6.1542969 38.175781 L 6.171875 38.199219 L 6.9140625 39.201172 L 6.9296875 39.224609 L 6.9492188 39.246094 L 7.7480469 40.207031 L 7.7675781 40.228516 L 7.7871094 40.25 L 8.6445312 41.167969 L 9.484375 41.478516 L 10.236328 40.992188 L 10.296875 40.097656 L 10.105469 39.802734 L 9.2597656 38.898438 L 9.2480469 38.884766 L 8.5019531 37.986328 L 7.8105469 37.054688 L 7.1582031 36.064453 L 7.1523438 36.052734 L 6.8007812 35.447266 L 6.0527344 34.955078 z M 40.388672 39.710938 A 1.0001 1.0001 0 0 0 39.699219 40.005859 C 39.471328 40.228983 39.23943 40.446477 39.001953 40.658203 A 1.0001 1.0001 0 1 0 40.332031 42.150391 C 40.592554 41.918117 40.847547 41.680423 41.097656 41.435547 A 1.0001 1.0001 0 0 0 40.388672 39.710938 z M 13.808594 42.970703 A 1.0001 1.0001 0 0 0 13.373047 44.839844 C 14.263676 45.360422 15.200023 45.829005 16.179688 46.236328 A 1.000376 1.000376 0 0 0 16.234375 46.255859 C 16.540377 46.38268 16.847719 46.503491 17.15625 46.615234 A 1.0001 1.0001 0 1 0 17.835938 44.734375 C 17.538788 44.626754 17.243239 44.511418 16.949219 44.388672 A 1.0001 1.0001 0 0 0 16.947266 44.388672 C 16.05093 44.015995 15.196185 43.588703 14.382812 43.113281 A 1.0001 1.0001 0 0 0 13.808594 42.970703 z M 34.226562 43.947266 L 33.884766 44.027344 L 32.857422 44.472656 L 32.84375 44.478516 L 31.941406 44.802734 L 31.324219 45.453125 L 31.474609 46.335938 L 32.273438 46.744141 L 32.619141 46.685547 L 33.535156 46.355469 L 33.564453 46.34375 L 33.59375 46.332031 L 34.677734 45.863281 L 35.253906 45.175781 L 35.048828 44.304688 L 34.226562 43.947266 z M 25.902344 45.96875 L 25.404297 45.998047 L 23.849609 45.970703 L 23.849609 45.992188 L 23.0625 46.300781 L 22.826172 47.164062 L 23.376953 47.871094 L 23.716797 47.964844 L 23.744141 47.966797 L 23.78125 47.970703 L 23.818359 47.970703 L 25.427734 47.998047 L 25.464844 47.998047 L 25.501953 47.996094 L 26.017578 47.966797 L 26.794922 47.519531 L 26.902344 46.630859 L 26.253906 46.011719 L 25.902344 45.96875 z" font-weight="400" font-family="sans-serif" white-space="normal" overflow="visible"></path>
                </svg>
                <svg v-else class="user-input__search-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
                    <g id="surface1">
                        <path d="M 19 3 C 13.488281 3 9 7.488281 9 13 C 9 15.394531 9.839844 17.589844 11.25 19.3125 L 3.28125 27.28125 L 4.71875 28.71875 L 12.6875 20.75 C 14.410156 22.160156 16.605469 23 19 23 C 24.511719 23 29 18.511719 29 13 C 29 7.488281 24.511719 3 19 3 Z M 19 5 C 23.429688 5 27 8.570313 27 13 C 27 17.429688 23.429688 21 19 21 C 14.570313 21 11 17.429688 11 13 C 11 8.570313 14.570313 5 19 5 Z "></path>
                    </g>
                </svg>
            </div>
            <input
                :disabled="userInputDisabled"
                ref="userInput"
                id="user-input"
                class="user-input__input"
                type="text"
                v-model="userInput"
                @keydown="keyPress"
            >
            <div class="user-input__user-confirmation-container" :class="{ 'visible' : refreshIndexesIsPending && !userConfirmationDialogVisible }">
                <span>{{ translations.refreshingIndexesPending }}...</span>
            </div>
            <div class="user-input__user-confirmation-container" :class="{ 'visible' : userConfirmationDialogVisible }">
                <svg class="user-input__user-confirmation-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 48 48" version="1.1">
                    <g id="surface1">
                        <path style=" fill:#F44336;" d="M 21.199219 44.800781 L 3.199219 26.800781 C 1.601563 25.199219 1.601563 22.699219 3.199219 21.101563 L 21.199219 3.101563 C 22.800781 1.5 25.300781 1.5 26.898438 3.101563 L 44.898438 21.101563 C 46.5 22.699219 46.5 25.199219 44.898438 26.800781 L 26.898438 44.800781 C 25.300781 46.398438 22.699219 46.398438 21.199219 44.800781 Z "></path>
                        <path style=" fill:#FFFFFF;" d="M 21.601563 32.699219 C 21.601563 32.398438 21.699219 32.101563 21.800781 31.800781 C 21.898438 31.5 22.101563 31.300781 22.300781 31.101563 C 22.5 30.898438 22.800781 30.699219 23.101563 30.601563 C 23.398438 30.5 23.699219 30.398438 24.101563 30.398438 C 24.5 30.398438 24.800781 30.5 25.101563 30.601563 C 25.398438 30.699219 25.699219 30.898438 25.898438 31.101563 C 26.101563 31.300781 26.300781 31.5 26.398438 31.800781 C 26.5 32.101563 26.601563 32.398438 26.601563 32.699219 C 26.601563 33 26.5 33.300781 26.398438 33.601563 C 26.300781 33.898438 26.101563 34.101563 25.898438 34.300781 C 25.699219 34.5 25.398438 34.699219 25.101563 34.800781 C 24.800781 34.898438 24.5 35 24.101563 35 C 23.699219 35 23.398438 34.898438 23.101563 34.800781 C 22.800781 34.699219 22.601563 34.5 22.300781 34.300781 C 22.101563 34.101563 21.898438 33.898438 21.800781 33.601563 C 21.699219 33.300781 21.601563 33.101563 21.601563 32.699219 Z M 25.800781 28.101563 L 22.199219 28.101563 L 21.699219 13 L 26.300781 13 Z "></path>
                    </g>
                </svg>
                <span>{{ translations.userConfirmationProceed }}</span>
            </div>
        </div>
        `,
    watch: {
        userInput(val: string) {
            this.userConfirmationDialogVisible = false;
            vueEventDispatcher.$emit(VueEventChannels.userInputChange, val);
        },
    },
});
