import Vue from "vue";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";
import { UserConfigOptions } from "../common/config/user-config-options";
import { cloneDeep } from "lodash";
import { defaultAppearanceOptions } from "../common/config/default-appearance-options";
import { Settings } from "./settings";

export const appearanceSettingsComponent = Vue.extend({
    data() {
        return {
            settingName: Settings.Appearance,
            visible: false,
        };
    },
    methods: {
        resetAll() {
            const config: UserConfigOptions = this.config;
            config.appearanceOptions = cloneDeep(defaultAppearanceOptions);
            this.updateConfig();
        },
        resetWindowWidth() {
            const config: UserConfigOptions = this.config;
            config.appearanceOptions.windowWidth = defaultAppearanceOptions.windowWidth;
            this.updateConfig();
        },
        resetMaxSearchResultsPerPage() {
            const config: UserConfigOptions = this.config;
            config.appearanceOptions.maxSearchResultsPerPage = defaultAppearanceOptions.maxSearchResultsPerPage;
            this.updateConfig();
        },
        resetSearchResultHeight() {
            const config: UserConfigOptions = this.config;
            config.appearanceOptions.searchResultHeight = defaultAppearanceOptions.searchResultHeight;
            this.updateConfig();
        },
        resetUserInputHeight() {
            const config: UserConfigOptions = this.config;
            config.appearanceOptions.userInputHeight = defaultAppearanceOptions.userInputHeight;
            this.updateConfig();
        },
        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config);
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.showSetting, (settingName: string) => {
            if (settingName === this.settingName) {
                this.visible = true;
            } else {
                this.visible = false;
            }
        });
    },
    props: ["config"],
    template: `
    <div v-if="visible">
        <div class="settings__setting-title title is-3">
            <span>Appearance</span>
            <button class="button" @click="resetAll">
                <span class="icon"><i class="fas fa-undo-alt"></i></span>
            </button>
        </div>
        <div class="settings__setting-content">
            <div class="settings__setting-content-item box">
                <div class="settings__setting-content-item-title">
                    <div class="title is-5">Window Width (in Pixels)</div>
                    <button class="button" @click="resetWindowWidth">
                        <span class="icon"><i class="fas fa-undo-alt"></i></span>
                    </button>
                </div>
                <div class="columns">
                    <div class="column field has-addons">
                        <div class="control is-expanded">
                            <input type="number" class="input" v-model="config.appearanceOptions.windowWidth">
                        </div>
                        <div class="control">
                            <button class="button is-success" @click="updateConfig">
                                <span class="icon"><i class="fas fa-check"></i></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="settings__setting-content-item box">
                <div class="settings__setting-content-item-title">
                    <div class="title is-5">Max Search Results (per Page)</div>
                    <button class="button" @click="resetMaxSearchResultsPerPage">
                        <span class="icon"><i class="fas fa-undo-alt"></i></span>
                    </button>
                </div>
                <div class="columns">
                    <div class="column field has-addons">
                        <div class="control is-expanded">
                            <input type="number" class="input" v-model="config.appearanceOptions.maxSearchResultsPerPage">
                        </div>
                        <div class="control">
                            <button class="button is-success" @click="updateConfig">
                                <span class="icon"><i class="fas fa-check"></i></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="settings__setting-content-item box">
                <div class="settings__setting-content-item-title">
                    <div class="title is-5">Search Result Height (in Pixels)</div>
                    <button class="button" @click="resetSearchResultHeight">
                        <span class="icon"><i class="fas fa-undo-alt"></i></span>
                    </button>
                </div>
                <div class="columns">
                    <div class="column field has-addons">
                        <div class="control is-expanded">
                            <input type="number" class="input" v-model="config.appearanceOptions.searchResultHeight">
                        </div>
                        <div class="control">
                            <button class="button is-success" @click="updateConfig">
                                <span class="icon"><i class="fas fa-check"></i></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="settings__setting-content-item box">
                <div class="settings__setting-content-item-title">
                    <div class="title is-5">User Input Height (in Pixels)</div>
                    <button class="button" @click="resetUserInputHeight">
                        <span class="icon"><i class="fas fa-undo-alt"></i></span>
                    </button>
                </div>
                <div class="columns">
                    <div class="column field has-addons">
                        <div class="control is-expanded">
                            <input type="number" class="input" v-model="config.appearanceOptions.userInputHeight">
                        </div>
                        <div class="control">
                            <button class="button is-success" @click="updateConfig">
                                <span class="icon"><i class="fas fa-check"></i></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
});
