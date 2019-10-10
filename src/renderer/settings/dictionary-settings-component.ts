import Vue from "vue";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { defaultDictionaryOptions } from "../../common/config/dictionary-options";
import { deepCopy } from "../../common/helpers/object-helpers";
import { PluginSettings } from "./plugin-settings";

export const dictionarySettingsComponent = Vue.extend({
    data() {
        return {
            isVisible: false,
            settingName: PluginSettings.Dictionary,
        };
    },

    methods: {
        toggleEnabled() {
            const config: UserConfigOptions = this.config;
            config.dictionaryOptions.isEnabled = !config.dictionaryOptions.isEnabled;
            this.updateConfig();
        },

        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config);
        },

        resetAll() {
            const config: UserConfigOptions = this.config;
            config.dictionaryOptions = deepCopy(defaultDictionaryOptions);
            this.updateConfig();
        },
    },

    mounted() {
        vueEventDispatcher.$on(VueEventChannels.showSetting, (settingName: string) => {
            this.isVisible = this.settingName === settingName;
        });
    },

    props: ["config", "translations"],

    template: `
        <div v-if="isVisible">
            <div class="settings__setting-title title is-3">
                <span>{{ translations.dictionary }}</span>
                <div>
                    <plugin-toggle :is-enabled="config.dictionaryOptions.isEnabled" :toggled="toggleEnabled"/>
                    <button class="button" @click="resetAll">
                        <span class="icon">
                            <i class="fas fa-undo-alt"></i>
                        </span>
                    </button>
                </div>
            </div>
            <p class="settings__setting-description" v-html="translations.dictionaryDescription"></p>
            <div class="settings__setting-content">
                <div v-if="!config.dictionaryOptions.isEnabled" class="settings__setting-disabled-overlay"></div>
                <div class="box">
                    <div class="settings__option-container">

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.dictionaryDebounceDelay }}</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="control">
                                        <input type="number" class="input" v-model="config.dictionaryOptions.debounceDelay" @change="updateConfig()">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.dictionaryMinSearchTermLength }}</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="control">
                                        <input type="number" class="input" v-model="config.dictionaryOptions.minSearchTermLength" @change="updateConfig()">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.dictionaryPrefix }}</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="control">
                                        <input type="input" class="input" v-model="config.dictionaryOptions.prefix" @change="updateConfig()">
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    `,
});
