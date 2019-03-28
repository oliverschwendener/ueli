import Vue from "vue";
import { Settings } from "./settings";
import { vueEventDispatcher } from "./../vue-event-dispatcher";
import { VueEventChannels } from "./../vue-event-channels";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { defaultTranslationOptions } from "../../common/config/default-translation-options";
import { cloneDeep } from "lodash";
import { TranslationLanguage } from "../../main/plugins/translation-execution-plugin/translation-language";

export const translationSettingsComponent = Vue.extend({
    data() {
        return {
            settingName: Settings.Translation,
            sourceLanguages: Object.values(TranslationLanguage),
            targetLanguages: Object.values(TranslationLanguage),
            visible: false,
        };
    },
    methods: {
        resetAll() {
            const config: UserConfigOptions = this.config;
            config.translationOptions = cloneDeep(defaultTranslationOptions);
            this.updateConfig();
        },
        toggleEnabled() {
            const config: UserConfigOptions = this.config;
            config.translationOptions.enabled = !config.translationOptions.enabled;
            this.updateConfig();
        },
        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config, false);
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
                    {{ translations.translationSettingsTranslation }}
                </span>
                <div>
                    <button class="button" :class="{ 'is-success' : config.translationOptions.enabled }" @click="toggleEnabled">
                        <span class="icon"><i class="fas fa-power-off"></i></span>
                    </button>
                    <button v-if="config.translationOptions.enabled" class="button" @click="resetAll">
                        <span class="icon"><i class="fas fa-undo-alt"></i></span>
                    </button>
                </div>
            </div>
            <div class="settings__setting-content" v-if="config.translationOptions.enabled">
                <div class="box">
                    <div class="settings__option-container">

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.translationSettingsDebounceDelay }}</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="control">
                                        <input
                                            type="number"
                                            class="input"
                                            min="1"
                                            v-model="config.translationOptions.debounceDelay"
                                            @change="updateConfig"
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.translationSettingsMinSearchTermLength }}</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="control">
                                        <input
                                            type="number"
                                            class="input"
                                            min="1"
                                            v-model="config.translationOptions.minSearchTermLength"
                                            @change="updateConfig"
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.translationSettingsPrefix }}</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="control">
                                        <input
                                            type="text"
                                            class="input font-mono"
                                            v-model="config.translationOptions.prefix"
                                            @change="updateConfig"
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.translationSettingsSourceLanguage }}</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="control">
                                        <div class="select">
                                            <select
                                                v-model="config.translationOptions.sourceLanguage"
                                                @change="updateConfig"
                                                >
                                                <option v-for="sourceLanguage in sourceLanguages">{{ sourceLanguage }}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.translationSettingsTargetLanguage }}</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="control">
                                        <div class="select">
                                            <select
                                                v-model="config.translationOptions.targetLanguage"
                                                @change="updateConfig"
                                                >
                                                <option v-for="targetLanguage in targetLanguages">{{ targetLanguage }}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
            <h6 v-else class="title is-6 has-text-danger">
                {{ translations.translationSettingsDisabled }}
            </h6>
        </div>
    `,
});
