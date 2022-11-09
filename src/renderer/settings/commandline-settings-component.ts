import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { PluginSettings } from "./plugin-settings";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { defaultCommandlineOptions } from "../../common/config/commandline-options";
import { TranslationSet } from "../../common/translation/translation-set";
import { UserConfirmationDialogParams, UserConfirmationDialogType } from "./modals/user-confirmation-dialog-params";
import { deepCopy } from "../../common/helpers/object-helpers";
import { getCurrentOperatingSystem } from "../../common/helpers/operating-system-helpers";
import { platform } from "os";
import { MacOsShell, WindowsShell } from "../../main/plugins/commandline-plugin/shells";
import { OperatingSystem } from "../../common/operating-system";
import { getFilePath } from "../dialogs";

const operatingSystem = getCurrentOperatingSystem(platform());

export const commandlineSettingsComponent = Vue.extend({
    data() {
        return {
            isWindows: operatingSystem === OperatingSystem.Windows,
            availableShells: Object.values(operatingSystem === OperatingSystem.Windows ? WindowsShell : MacOsShell).map(
                (shell) => shell.toString(),
            ),
            settingName: PluginSettings.Commandline,
            visible: false,
        };
    },
    methods: {
        resetAll() {
            const translations: TranslationSet = this.translations;
            const userConfirmationDialogParams: UserConfirmationDialogParams = {
                callback: () => {
                    const config: UserConfigOptions = this.config;
                    config.commandlineOptions = deepCopy(defaultCommandlineOptions);
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
            config.commandlineOptions.isEnabled = !config.commandlineOptions.isEnabled;
            this.updateConfig();
        },
        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config);
        },
        selectFile() {
            const filters: Electron.FileFilter[] = [
                {
                    extensions: ["exe"],
                    name: "Search path to shell binary",
                },
            ];
            getFilePath(filters)
                .then((filePath) => {
                    const config: UserConfigOptions = this.config;
                    config.commandlineOptions.customShell = filePath;
                })
                .catch(() => {
                    // do nothing if no file is selected
                });
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
                    {{ translations.commandline }}
                </span>
                <div>
                    <plugin-toggle :is-enabled="config.commandlineOptions.isEnabled" :toggled="toggleEnabled"/>
                    <button class="button" @click="resetAll">
                        <span class="icon">
                            <i class="fas fa-undo-alt"></i>
                        </span>
                    </button>
                </div>
            </div>
            <p class="settings__setting-description" v-html="translations.commandlineSettingsDescription"></p>
            <div class="settings__setting-content">
                <div v-if="!config.commandlineOptions.isEnabled" class="settings__setting-disabled-overlay"></div>
                <div class="box">
                    <div class="settings__options-container">

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.commandlinePrefix }}</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="control">
                                        <input class="input font-mono" v-model="config.commandlineOptions.prefix" @change="updateConfig">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.commandlineShell }}</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="control">
                                        <div class="select">
                                            <select :disabled="config.commandlineOptions.isCustom" v-model="config.commandlineOptions.shell" @change="updateConfig">
                                                <option v-for="availableShell in availableShells">{{ availableShell }}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="isWindows" class="settings__option">
                            <div class="settings__option-name">Custom shell</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="control">
                                        <input id="customShellToggle" type="checkbox" name="customShellToggle" class="switch is-rounded is-success" checked="checked" v-model="config.commandlineOptions.isCustom" @change="updateConfig()">
                                        <label for="customShellToggle"></label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings__setting-content-item box">
                    <div class="settings__setting-content-item-title mb-2">
                        <div class="title is-5">
                            Path to binary
                        </div>
                    </div>
                    <div class="columns">
                        <div class="column field has-addons">
                            <div class="control is-expanded">
                                <input type="text" class="input" v-model="config.commandlineOptions.customShell" :disabled="!config.commandlineOptions.isCustom">
                            </div>
                            <div class="control">
                                <button class="button" @click="selectFile" :disabled="!config.commandlineOptions.isCustom">
                                    <span class="icon">
                                        <i class="fas fa-folder"></i>
                                    </span>
                                </button>
                            </div>
                            <div class="control">
                                <button class="button is-success" @click="updateConfig" :disabled="!config.commandlineOptions.isCustom">
                                        <span class="icon">
                                            <i class="fas fa-check"></i>
                                        </span>
                                </button>
                            </div>
                        </div>
                    </div>
    
                    <div class="settings__setting-content-item-title mb-2">
                        <div class="title is-5">
                            Shell flags
                        </div>
                    </div>
                    <div class="columns">
                        <div class="column field has-addons">
                            <div class="control is-expanded">
                                <input type="text" class="input" v-model="config.commandlineOptions.customShellFlags" @change="updateConfig" :disabled="!config.commandlineOptions.isCustom">
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `,
});
