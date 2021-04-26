import Vue from "vue";
import { SettingOsSpecific } from "./settings-os-specific";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { defaultEverythingSearchOptions } from "../../common/config/everything-search-options";
import { platform } from "os";
import { getFilePath } from "../dialogs";
import { TranslationSet } from "../../common/translation/translation-set";
import { UserConfirmationDialogParams, UserConfirmationDialogType } from "./modals/user-confirmation-dialog-params";
import { deepCopy } from "../../common/helpers/object-helpers";

export const everythingSettingsComponent = Vue.extend({
    data() {
        return {
            settingsName: SettingOsSpecific.Everything.replace(`${platform()}:`, ""),
            visible: false,
        };
    },
    methods: {
        toggleEnabled() {
            const config: UserConfigOptions = this.config;
            config.everythingSearchOptions.enabled = !config.everythingSearchOptions.enabled;
            this.updateConfig();
        },
        resetAll() {
            const translations: TranslationSet = this.translations;
            const userConfirmationDialogParams: UserConfirmationDialogParams = {
                callback: () => {
                    const config: UserConfigOptions = this.config;
                    config.everythingSearchOptions = deepCopy(defaultEverythingSearchOptions);
                    this.updateConfig();
                },
                message: translations.resetPluginSettingsToDefaultWarning,
                modalTitle: translations.resetToDefault,
                type: UserConfirmationDialogType.Default,
            };
            vueEventDispatcher.$emit(VueEventChannels.settingsConfirmation, userConfirmationDialogParams);
        },
        resetPathToEs() {
            const config: UserConfigOptions = this.config;
            config.everythingSearchOptions.pathToEs = defaultEverythingSearchOptions.pathToEs;
            this.updateConfig();
        },
        resetPrefix() {
            const config: UserConfigOptions = this.config;
            config.everythingSearchOptions.prefix = defaultEverythingSearchOptions.prefix;
            this.updateConfig();
        },
        resetMaxSearchResults() {
            const config: UserConfigOptions = this.config;
            config.everythingSearchOptions.maxSearchResults = defaultEverythingSearchOptions.maxSearchResults;
            this.updateConfig();
        },
        selectFile() {
            const translations: TranslationSet = this.translations;
            const filters: Electron.FileFilter[] = [
                {
                    extensions: ["exe"],
                    name: translations.everythingSearchPathToBinaryFilterName,
                },
            ];
            getFilePath(filters)
                .then((filePath) => {
                    const config: UserConfigOptions = this.config;
                    config.everythingSearchOptions.pathToEs = filePath;
                })
                .catch((err) => {
                    // do nothing if no file is selected
                });
        },
        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config);
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.showSetting, (settingsName: string) => {
            if (this.settingsName === settingsName) {
                this.visible = true;
            } else {
                this.visible = false;
            }
        });
    },
    props: ["config", "translations"],
    template: `
        <div v-if="visible" class="">
            <div class="settings__setting-title title is-3">
                <span>
                    {{ translations.everythingSearch }}
                </span>
                <div>
                    <plugin-toggle :is-enabled="config.everythingSearchOptions.enabled" :toggled="toggleEnabled"/>
                    <button v-if="config.applicationSearchOptions.enabled" class="button" @click="resetAll">
                        <span class="icon"><i class="fas fa-undo-alt"></i></span>
                    </button>
                </div>
            </div>
            <p class="settings__setting-description" v-html="translations.everythingSearchSettingDescription"></p>
            <div class="settings__setting-content">
                <div v-if="!config.everythingSearchOptions.enabled" class="settings__setting-disabled-overlay"></div>
                <div class="settings__setting-content-item box">
                    <div class="settings__setting-content-item-title">
                        <div class="title is-5">
                            {{ translations.everythingSearchPathToBinary }}
                        </div>
                        <button class="button" @click="resetPathToEs">
                            <span class="icon">
                                <i class="fas fa-undo-alt"></i>
                            </span>
                        </button>
                    </div>
                    <div class="columns">
                        <div class="column field has-addons">
                            <div class="control is-expanded">
                                <input type="text"class="input" v-model="config.everythingSearchOptions.pathToEs">
                            </div>
                            <div class="control">
                                <button class="button" @click="selectFile">
                                    <span class="icon">
                                        <i class="fas fa-folder"></i>
                                    </span>
                                </button>
                            </div>
                            <div class="control">
                                <button class="button is-success" @click="updateConfig">
                                    <span class="icon">
                                        <i class="fas fa-check"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings__setting-content-item box">
                    <div class="settings__setting-content-item-title">
                        <div class="title is-5">
                            {{ translations.everythingSearchPrefix }}
                        </div>
                        <button class="button" @click="resetPrefix">
                            <span class="icon">
                                <i class="fas fa-undo-alt"></i>
                            </span>
                        </button>
                    </div>
                    <div class="columns">
                        <div class="column field has-addons">
                            <div class="control is-expanded">
                                <input type="text"class="input font-mono" v-model="config.everythingSearchOptions.prefix">
                            </div>
                            <div class="control">
                                <button class="button is-success" @click="updateConfig">
                                    <span class="icon">
                                        <i class="fas fa-check"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings__setting-content-item box">
                    <div class="settings__setting-content-item-title">
                        <div class="title is-5">
                            {{ translations.everythingSearchMaxSearchResults }}
                        </div>
                        <button class="button" @click="resetMaxSearchResults">
                            <span class="icon">
                                <i class="fas fa-undo-alt"></i>
                            </span>
                        </button>
                    </div>
                    <div class="columns">
                        <div class="column field has-addons">
                            <div class="control is-expanded">
                                <input type="number" min="1" class="input" v-model="config.everythingSearchOptions.maxSearchResults">
                            </div>
                            <div class="control">
                                <button class="button is-success" @click="updateConfig">
                                    <span class="icon">
                                        <i class="fas fa-check"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
});
