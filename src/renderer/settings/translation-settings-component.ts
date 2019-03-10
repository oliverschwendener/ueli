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
        resetDebounceDelay() {
            const config: UserConfigOptions = this.config;
            config.translationOptions.debounceDelay = defaultTranslationOptions.debounceDelay;
            this.updateConfig();
        },
        resetMinSearchTermLength() {
            const config: UserConfigOptions = this.config;
            config.translationOptions.minSearchTermLength = defaultTranslationOptions.minSearchTermLength;
            this.updateConfig();
        },
        resetPrefix() {
            const config: UserConfigOptions = this.config;
            config.translationOptions.prefix = defaultTranslationOptions.prefix;
            this.updateConfig();
        },
        resetSourceLanguage() {
            const config: UserConfigOptions = this.config;
            config.translationOptions.sourceLanguage = defaultTranslationOptions.sourceLanguage;
            this.updateConfig();
        },
        resetTargetLanguage() {
            const config: UserConfigOptions = this.config;
            config.translationOptions.targetLanguage = defaultTranslationOptions.targetLanguage;
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

                <div class="settings__setting-content-item box">
                    <div class="settings__setting-content-item-title">
                        <div class="title is-5">
                            {{ translations.translationSettingsDebounceDelay }}
                        </div>
                        <button class="button" @click="resetDebounceDelay"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                    </div>
                    <div class="columns">
                        <div class="column field has-addons">
                            <div class="control is-expanded">
                                <input type="number" class="input" min="1" v-model="config.translationOptions.debounceDelay">
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
                        <div class="title is-5">
                            {{ translations.translationSettingsMinSearchTermLength }}
                        </div>
                        <button class="button" @click="resetMinSearchTermLength"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                    </div>
                    <div class="columns">
                        <div class="column field has-addons">
                            <div class="control is-expanded">
                                <input type="number" class="input" min="1" v-model="config.translationOptions.minSearchTermLength">
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
                        <div class="title is-5">
                            {{ translations.translationSettingsPrefix }}
                        </div>
                        <button class="button" @click="resetPrefix"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                    </div>
                    <div class="columns">
                        <div class="column field has-addons">
                            <div class="control is-expanded">
                                <input type="text" class="input font-mono" v-model="config.translationOptions.prefix">
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
                        <div class="title is-5">
                            {{ translations.translationSettingsSourceLanguage }}
                        </div>
                        <button class="button" @click="resetSourceLanguage"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                    </div>
                    <div class="columns">
                        <div class="column field has-addons">
                            <div class="control is-expanded">
                                <div class="select is-fullwidth">
                                    <select v-model="config.translationOptions.sourceLanguage">
                                        <option v-for="sourceLanguage in sourceLanguages">{{ sourceLanguage }}</option>
                                    </select>
                                </div>
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
                        <div class="title is-5">
                            {{ translations.translationSettingsTargetLanguage }}
                        </div>
                        <button class="button" @click="resetTargetLanguage"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                    </div>
                    <div class="columns">
                        <div class="column field has-addons">
                            <div class="control is-expanded">
                                <div class="select is-fullwidth">
                                    <select v-model="config.translationOptions.targetLanguage">
                                        <option v-for="targetLanguage in targetLanguages">{{ targetLanguage }}</option>
                                    </select>
                                </div>
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
            <h6 v-else class="title is-6 has-text-danger">
                {{ translations.translationSettingsDisabled }}
            </h6>
        </div>
    `,
});
