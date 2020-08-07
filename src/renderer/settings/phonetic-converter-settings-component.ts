import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { PluginSettings } from "./plugin-settings";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { defaultPhoneticConverterOptions } from "../../common/config/phonetic-converter-options";
import { TranslationSet } from "../../common/translation/translation-set"; // TODO(flechnical): add localization in settings page; only hard-coded English for now
import { UserConfirmationDialogParams, UserConfirmationDialogType } from "./modals/user-confirmation-dialog-params";
import { deepCopy } from "../../common/helpers/object-helpers";

export const phoneticConverterSettingsComponent = Vue.extend({
    data() {
        return {
            settingName: PluginSettings.PhoneticConverter,
            visible: false,
        };
    },
    methods: {
        resetAll() {
            const translations: TranslationSet = this.translations;
            const userConfirmationDialogParams: UserConfirmationDialogParams = {
                callback: () => {
                    const config: UserConfigOptions = this.config;
                    config.phoneticConverterOptions = deepCopy(defaultPhoneticConverterOptions);
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
            config.phoneticConverterOptions.enabled = !config.phoneticConverterOptions.enabled;
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
                    ICAO/NATO Phonetic Alphabet Converter
                </span>
                <div>
                    <plugin-toggle :is-enabled="config.phoneticConverterOptions.enabled" :toggled="toggleEnabled"/>
                    <button v-if="config.phoneticConverterOptions.enabled" class="button" @click="resetAll">
                        <span class="icon"><i class="fas fa-undo-alt"></i></span>
                    </button>
                </div>
            </div>
            <p class="settings__setting-description">This plugin converts your input into the words of the ICAO/NATO Phonetic Alphabet or your preferred localized equivalent. You can copy the original input by pressing [Enter].</p>
            <div class="settings__setting-content" >
                <div v-if="!config.phoneticConverterOptions.enabled" class="settings__setting-disabled-overlay"></div>
                <div class="box">
                    <div class="settings__option-container">

                    <div class="settings__option">
                        <div class="settings__option-name">Prefix</div>
                        <div class="settings__option-content">
                            <div class="field is-grouped is-grouped-right">
                                <div class="control">
                                    <input
                                        type="text"
                                        class="input font-mono"
                                        v-model="config.phoneticConverterOptions.prefix"
                                        @change="updateConfig"
                                    >
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="settings__option">
                        <div class="settings__option-name">Enable English Alphabet</div>
                        <div class="settings__option-content">
                            <div class="field has-addons has-addons-right vertical-center">
                                <div class="control">
                                    <input id="enableEnglishCheckbox" type="checkbox" name="enableEnglishCheckbox" class="switch is-rounded is-success" checked="checked" v-model="config.phoneticConverterOptions.enableEnglish" @change="updateConfig">
                                    <label for="enableEnglishCheckbox"></label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="settings__option">
                        <div class="settings__option-name">Enable German Alphabet</div>
                        <div class="settings__option-content">
                            <div class="field has-addons has-addons-right vertical-center">
                                <div class="control">
                                    <input id="enableGermanCheckbox" type="checkbox" name="enableGermanCheckbox" class="switch is-rounded is-success" checked="checked" v-model="config.phoneticConverterOptions.enableGerman" @change="updateConfig">
                                    <label for="enableGermanCheckbox"></label>
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
