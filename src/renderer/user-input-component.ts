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

        vueEventDispatcher.$on(VueEventChannels.mouseClick, (index: number, shiftKey: boolean) => {
            const privileged: boolean = shiftKey;
            const userConfirmed: boolean = this.userConfirmationDialogVisible;
            vueEventDispatcher.$emit(VueEventChannels.executeMouseClick, this.userInput, index, privileged, userConfirmed);
        });

        vueEventDispatcher.$on(VueEventChannels.appearanceOptionsUpdated, (updatedAppearanceOptions: AppearanceOptions) => {
            const config: UserConfigOptions = this.config;
            config.appearanceOptions = updatedAppearanceOptions;
        });

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
                <svg v-if="loadingVisible" class="user-input__search-icon spinning" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                    <path d="m16 3c-7.2 0-13 5.9-13 13 0 7.2 5.8 13 13 13s13-5.8 13-13h-2c0 6.1-4.9 11-11 11s-11-4.9-11-11 4.9-11 11-11z"></path>
                </svg>
                <svg v-else class="user-input__search-icon" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 32 32">
                    <path d="m19.5 3c-5.2 0-9.5 4.3-9.5 9.5 0 2.1.7 4.1 2 5.8l-9 9 1.4 1.4 9-9c1.7 1.5 3.8 2.3 6.1 2.3 5.2 0 9.5-4.3 9.5-9.5s-4.3-9.5-9.5-9.5zm0 2c4.2 0 7.5 3.4 7.5 7.5s-3.4 7.5-7.5 7.5-7.5-3.4-7.5-7.5 3.4-7.5 7.5-7.5z"></path>
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
                <svg class="user-input__user-confirmation-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                    <g style="fill:#f44336">
                        <path d="m3 3v26h26v-26zm2 2h22v22h-22z"></path>
                        <path d="m8 17 7-5v4h7v-6h2v8h-9v4z"></path>
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
