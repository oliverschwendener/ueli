import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { PluginSettings } from "./plugin-settings";
import { UserConfigOptions } from "../../common/config/user-config-options";
import {defaultReminderOptions} from "../../common/config/reminder-options";
import { TranslationSet } from "../../common/translation/translation-set";
import { UserConfirmationDialogParams, UserConfirmationDialogType } from "./modals/user-confirmation-dialog-params";
import { deepCopy } from "../../common/helpers/object-helpers";


export const ReminderSettingsComponent = Vue.extend({
    data() {
        return {
            settingName: PluginSettings.Reminder,
            visible: true,
        };
    },
    methods: {
        resetAll() {
            const translations: TranslationSet = this.translations;
            const userConfirmationDialogParams: UserConfirmationDialogParams = {
                callback: () => {
                    const config: UserConfigOptions = this.config;
                    config.reminderOptions = deepCopy(defaultReminderOptions);
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
            config.reminderOptions.isEnabled = !config.reminderOptions.isEnabled;
            this.updateConfig();
        },
        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config);
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.showSetting, (settingName: string) => {
            this.visible = this.settingName === settingName;
        });
    },
    props: ["config", "translations"],
    template: `
        <div v-if="visible">
            <div class="settings__setting-title title is-3">
                <span>
                    {{ translations.reminder }}
                </span>
                <div>
                    <plugin-toggle :is-enabled="config.reminderOptions.isEnabled" :toggled="toggleEnabled"/>
                    <button class="button" @click="resetAll">
                        <span class="icon">
                            <i class="fas fa-undo-alt"></i>
                        </span>
                    </button>
                </div>
            </div>
            <p class="settings__setting-description" v-html="translations.reminderSettingsDescription"></p>
            <div class="settings__setting-content">
                <div v-if="!config.reminderOptions.isEnabled" class="settings__setting-disabled-overlay"></div>
                <div class="box">
                    <div class="settings__options-container">
                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.reminderPrefix }}</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="control">
                                        <input class="input font-mono" v-model="config.reminderOptions.prefix" @change="updateConfig">
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
