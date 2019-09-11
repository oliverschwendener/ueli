import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { SettingOsSpecific } from "./settings-os-specific";
import { platform } from "os";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { defaultMdfindOptions } from "../../common/config/mdfind-options";
import { TranslationSet } from "../../common/translation/translation-set";
import { UserConfirmationDialogParams, UserConfirmationDialogType } from "./modals/user-confirmation-dialog-params";
import { deepCopy } from "../../common/helpers/object-helpers";

export const mdfindSettingsComponent = Vue.extend({
    data() {
        return {
            settingName: SettingOsSpecific.MdFind.replace(`${platform()}:`, ""),
            visible: false,
        };
    },
    methods: {
        resetAll() {
            const translations: TranslationSet = this.translations;
            const userConfirmationDialogParams: UserConfirmationDialogParams = {
                callback: () => {
                    const config: UserConfigOptions = this.config;
                    config.mdfindOptions = deepCopy(defaultMdfindOptions);
                    this.updateConfig();
                },
                message: translations.resetPluginSettingsToDefaultWarning,
                modalTitle: translations.resetToDefault,
                type: UserConfirmationDialogType.Default,
            };
            vueEventDispatcher.$emit(VueEventChannels.settingsConfirmation, userConfirmationDialogParams);
        },
        toggleEnabled() {
            const config: UserConfigOptions = this.config;
            config.mdfindOptions.enabled = !config.mdfindOptions.enabled;
            this.updateConfig();
        },
        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config);
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.showSetting, (setting: string) => {
            if (setting === this.settingName) {
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
                    {{ translations.mdfindSearch }}
                </span>
                <div>
                    <plugin-toggle :is-enabled="config.mdfindOptions.enabled" :toggled="toggleEnabled"/>
                    <button v-if="config.mdfindOptions.enabled" class="button" @click="resetAll">
                        <span class="icon"><i class="fas fa-undo-alt"></i></span>
                    </button>
                </div>
            </div>
            <p class="settings__setting-description" v-html="translations.mdfindSettingsDescription"></p>
            <div class="settings__setting-content" >
                <div v-if="!config.mdfindOptions.enabled" class="settings__setting-disabled-overlay"></div>
                <div class="box">
                    <div class="settings__option-container">

                    <div class="settings__option">
                        <div class="settings__option-name">{{ translations.mdfindSearchDebounceDelay }}</div>
                        <div class="settings__option-content">
                            <div class="field is-grouped is-grouped-right">
                                <div class="control">
                                    <input
                                        type="number"
                                        min="1"
                                        class="input"
                                        v-model="config.mdfindOptions.debounceDelay"
                                        @change="updateConfig"
                                        >
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="settings__option">
                        <div class="settings__option-name">{{ translations.mdfindSearchPrefix }}</div>
                        <div class="settings__option-content">
                            <div class="field is-grouped is-grouped-right">
                                <div class="control">
                                    <input
                                        type="text"
                                        class="input font-mono"
                                        v-model="config.mdfindOptions.prefix"
                                        @change="updateConfig"
                                    >
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="settings__option">
                        <div class="settings__option-name">{{ translations.mdfindSearchMaxSearchResults }}</div>
                        <div class="settings__option-content">
                            <div class="field is-grouped is-grouped-right">
                                <div class="control">
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        class="input"
                                        v-model="config.mdfindOptions.maxSearchResults"
                                        @change="updateConfig"
                                        >
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
