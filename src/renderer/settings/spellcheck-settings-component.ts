import Vue from "vue";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { defaultSpellcheckOptions } from "../../common/config/spellcheck-options";
import { deepCopy } from "../../common/helpers/object-helpers";
import { PluginSettings } from "./plugin-settings";

export const spellCheckSettingsComponent = Vue.extend({
    data() {
        return {
            isVisible: false,
            settingName: PluginSettings.SpellCheck,
        };
    },

    methods: {
        toggleEnabled() {
            const config: UserConfigOptions = this.config;
            config.spellcheckOptions.isEnabled = !config.spellcheckOptions.isEnabled;
            this.updateConfig();
        },

        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config);
        },

        resetAll() {
            const config: UserConfigOptions = this.config;
            config.spellcheckOptions = deepCopy(defaultSpellcheckOptions);
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
                <span>{{ translations.spellCheck }}</span>
                <div>
                    <plugin-toggle :is-enabled="config.spellcheckOptions.isEnabled" :toggled="toggleEnabled"/>
                    <button class="button" @click="resetAll">
                        <span class="icon">
                            <i class="fas fa-undo-alt"></i>
                        </span>
                    </button>
                </div>
            </div>
            <p class="settings__setting-description" v-html="translations.spellCheckDescription"></p>
            <div class="settings__setting-content">
                <div v-if="!config.spellcheckOptions.isEnabled" class="settings__setting-disabled-overlay"></div>
                <div class="box">
                    <div class="settings__option-container">

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.spellCheckDebounceDelay }}</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="control">
                                        <input type="number" class="input" v-model="config.spellcheckOptions.debounceDelay" @change="updateConfig()">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.spellCheckMinSearchTermLength }}</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="control">
                                        <input type="number" class="input" v-model="config.spellcheckOptions.minSearchTermLength" @change="updateConfig()">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.spellCheckPrefix }}</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="control">
                                        <input type="input" class="input" v-model="config.spellcheckOptions.prefix" @change="updateConfig()">
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
