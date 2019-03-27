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
            <div class="box">
                <div class="settings__options-container">

                    <div class="settings__option">
                        <div class="settings__option-name">
                            <span>
                                {{ translations.searchEngineSettingsFuzzyness }}
                            </span>
                            <span class="icon tooltip" :data-tooltip="translations.searchEngineSettingsFuzzynessDescription">
                                <i class="fa fa-info-circle"></i>
                            </span>
                        </div>
                        <div class="settings__option-content">
                            <div class="field is-grouped is-grouped-right vertical-center">
                                <div class="control">
                                    <input class="slider" type="range" min="0.01" max="1" step="0.01" v-model="config.searchEngineOptions.fuzzyness" @change="updateConfig">
                                </div>
                                <div class="control">
                                    <input class="input" type="number" min="0" max="1" step="0.05" v-model="config.searchEngineOptions.fuzzyness">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="settings__option">
                        <div class="settings__option-name">{{ translations.searchEngineSettingsMaxSearchResults }}</div>
                        <div class="settings__option-content">
                            <div class="field has-addons has-addons-right">
                                <div class="control">
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
            </div>

        </div>
    </div>`,
});
