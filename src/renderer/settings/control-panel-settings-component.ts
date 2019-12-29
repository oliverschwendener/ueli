import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { TranslationSet } from "../../common/translation/translation-set";
import { UserConfirmationDialogParams, UserConfirmationDialogType } from "./modals/user-confirmation-dialog-params";
import { deepCopy } from "../../common/helpers/object-helpers";
import { defaultControlPanelOptions } from "../../common/config/control-panel-options";
import { SettingOsSpecific } from "./settings-os-specific";
import { platform } from "os";
import { PluginType } from "../../main/plugin-type";

export const controlPanelSettingsComponent = Vue.extend({
    data() {
        return {
            settingName: SettingOsSpecific.ControlPanel.replace(`${platform()}:`, ""),
            visible: false,
        };
    },
    methods: {
        toggleEnabled() {
            const config: UserConfigOptions = this.config;
            config.controlPanelOptions.isEnabled = !config.controlPanelOptions.isEnabled;
            this.updateConfig();
        },
        resetAll() {
            const translations: TranslationSet = this.translations;
            const userConfirmationDialogParams: UserConfirmationDialogParams = {
                callback: () => {
                    const config: UserConfigOptions = this.config;
                    config.controlPanelOptions = deepCopy(defaultControlPanelOptions);
                    this.updateConfig();
                },
                message: translations.resetPluginSettingsToDefaultWarning,
                modalTitle: translations.resetToDefault,
                type: UserConfirmationDialogType.Default,
            };
            vueEventDispatcher.$emit(VueEventChannels.settingsConfirmation, userConfirmationDialogParams);
        },
        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config, true, PluginType.ControlPanel);
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
                {{ translations.controlPanel }}
            </span>
            <div>
                <plugin-toggle :is-enabled="config.controlPanelOptions.isEnabled" :toggled="toggleEnabled"/>
                <button class="button" @click="resetAll">
                    <span class="icon">
                        <i class="fas fa-undo-alt"></i>
                    </span>
                </button>
            </div>
        </div>
        <p class="settings__setting-description" v-html="translations.controlPanelSettingsDescription"></p>
    </div>
    `,
});
