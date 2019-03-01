import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { cloneDeep } from "lodash";
import { defaultSearchEngineOptions } from "../../common/config/default-search-engine-options";
import { Settings } from "./settings";

export const searchEngineSettingsComponent = Vue.extend({
    data() {
        return {
            settingName: Settings.SearchEngine,
            visible: false,
        };
    },
    methods: {
        resetAll() {
            const config: UserConfigOptions = this.config;
            config.searchEngineOptions = cloneDeep(defaultSearchEngineOptions);
            this.updateConfig();
        },
        resetFuzzyness() {
            const config: UserConfigOptions = this.config;
            config.searchEngineOptions.fuzzyness = defaultSearchEngineOptions.fuzzyness;
            this.updateConfig();
        },
        resetMaxSearchResults() {
            const config: UserConfigOptions = this.config;
            config.searchEngineOptions.maxSearchResults = defaultSearchEngineOptions.maxSearchResults;
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
    props: ["config", "translations"],
    template: `
    <div v-if="visible">
        <div class="settings__setting-title title is-3">
            <span>
                {{ translations.searchEngineSettings }}
            </span>
            <button class="button" @click="resetAll">
                <span class="icon"><i class="fas fa-undo-alt"></i></span>
            </button>
        </div>
        <div class="settings__setting-content">
            <div class="settings__setting-content-item box">
                <div class="settings__setting-content-item-title">
                    <div class="title is-5">
                        {{ translations.searchEngineSettingsFuzzyness }}
                    </div>
                    <button class="button" @click="resetFuzzyness">
                        <span class="icon">
                            <i class="fas fa-undo-alt"></i>
                        </span>
                    </button>
                </div>
                <div class="columns is-vcentered">
                    <div class="column is-one-fifths">
                        {{ translations.searchEngineSettingsStrict }}
                    </div>
                    <div class="column is-three-fifths">
                        <div class="control is-expanded">
                            <input class="slider is-fullwidth is-large" type="range" min="0.01" max="1" step="0.01" v-model="config.searchEngineOptions.fuzzyness" @change="updateConfig">
                        </div>
                    </div>
                    <div class="column is-one-fifths has-text-right">
                        {{ translations.searchEngineSettingsFuzzy }}
                    </div>
                </div>
                <div class="columns">
                    <div class="column has-text-centered">
                        <span class="title is-6 has-text-centered">{{ config.searchEngineOptions.fuzzyness }}</span>
                    </div>
                </div>
            </div>
            <div class="settings__setting-content-item box">
                <div class="settings__setting-content-item-title">
                    <div class="title is-5">
                        {{ translations.searchEngineSettingsMaxSearchResults }}
                    </div>
                    <button class="button" @click="resetMaxSearchResults"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                </div>
                <div class="columns">
                    <div class="column field has-addons">
                        <div class="control is-expanded">
                            <input class="input" type="number" min="1" v-model="config.searchEngineOptions.maxSearchResults">
                        </div>
                        <div class="control">
                            <button class="button is-success" @click="updateConfig">
                                <span class="icon"><i class="fa fa-check"></i></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`,
});
