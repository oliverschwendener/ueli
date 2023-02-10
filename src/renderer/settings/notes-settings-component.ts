import Vue from "vue";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { defaultNotesOptions } from "../../common/config/notes-options";
import { PluginSettings } from "./plugin-settings";
import { TranslationSet } from "../../common/translation/translation-set";
import { UserConfirmationDialogParams, UserConfirmationDialogType } from "./modals/user-confirmation-dialog-params";
import { deepCopy } from "../../common/helpers/object-helpers";

export const notesSettingsComponent = Vue.extend({
    data() {
        return {
            settingName: PluginSettings.Notes,
            visible: false,
        };
    },
    methods: {
        toggleEnabled() {
            const config: UserConfigOptions = this.config;
            config.notesOptions.isEnabled = !config.notesOptions.isEnabled;
            this.updateConfig();
        },
        resetAll() {
            const translations: TranslationSet = this.translations;
            const userConfirmationDialogParams: UserConfirmationDialogParams = {
                callback: () => {
                    const config: UserConfigOptions = this.config;
                    config.notesOptions = deepCopy(defaultNotesOptions);
                    this.updateConfig();
                },
                message: translations.resetPluginSettingsToDefaultWarning,
                modalTitle: translations.resetToDefault,
                type: UserConfirmationDialogType.Default,
            };
            vueEventDispatcher.$emit(VueEventChannels.settingsConfirmation, userConfirmationDialogParams);
        },
        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config);
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.showSetting, (settingName: string) => {
            if (this.settingName === settingName) {
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
                    {{ "translations.notes" }}
                </span>
                <div>
                    <plugin-toggle :is-enabled="config.notesOptions.isEnabled" :toggled="toggleEnabled"/>
                    <button class="button" @click="resetAll">
                        <span class="icon">
                            <i class="fas fa-undo-alt"></i>
                        </span>
                    </button>
                </div>
            </div>
            <p class="settings__setting-description" v-html="translations.loremIpsumSettingsDescription"></p>
            <div class="settings__setting-content">
                <div v-if="!config.notesOptions.isEnabled" class="settings__setting-disabled-overlay"></div>
                <div class="box">
                    <div class="settings__options-container">

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.loremIpsumPrefix }}</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="control">
                                        <input class="input font-mono" v-model="config.notesOptions.prefixWrite" @change="updateConfig">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.loremIpsumPrefix }}</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="control">
                                        <input class="input font-mono" v-model="config.notesOptions.prefixRead" @change="updateConfig">
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
