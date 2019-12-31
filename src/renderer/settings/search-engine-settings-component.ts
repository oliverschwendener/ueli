import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { defaultSearchEngineOptions } from "../../common/config/search-engine-options";
import { GeneralSettings } from "./general-settings";
import { UserConfirmationDialogParams, UserConfirmationDialogType } from "./modals/user-confirmation-dialog-params";
import { TranslationSet } from "../../common/translation/translation-set";
import { deepCopy } from "../../common/helpers/object-helpers";

export const searchEngineSettingsComponent = Vue.extend({
    data() {
        return {
            newBlackListEntry: "",
            settingName: GeneralSettings.SearchEngine,
            visible: false,
        };
    },
    methods: {
        resetAll() {
            const translations: TranslationSet = this.translations;
            const userConfirmationDialogParams: UserConfirmationDialogParams = {
                callback: () => {
                    const config: UserConfigOptions = this.config;
                    config.searchEngineOptions = deepCopy(defaultSearchEngineOptions);
                    this.updateConfig();
                },
                message: translations.searchEngineSettingsResetWarning,
                modalTitle: translations.resetToDefault,
                type: UserConfirmationDialogType.Default,
            };
            vueEventDispatcher.$emit(VueEventChannels.settingsConfirmation, userConfirmationDialogParams);
        },
        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config);
        },
        addBlackListEntry() {
            if (this.newBlackListEntry.length > 0) {
                const config: UserConfigOptions = this.config;
                config.searchEngineOptions.blackList.push(this.newBlackListEntry);
                this.newBlackListEntry = "";
                this.updateConfig();
            }
        },
        removeBlackListEntry(index: number) {
            const config: UserConfigOptions = this.config;
            config.searchEngineOptions.blackList.splice(index, 1);
            this.updateConfig();
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
                {{ translations.searchEngineSettings }}
            </span>
            <button class="button" @click="resetAll">
                <span class="icon"><i class="fas fa-undo-alt"></i></span>
            </button>
        </div>
        <p class="settings__setting-description" v-html="translations.searchEngineSettingsDescription"></p>
        <div class="settings__setting-content">
            <div class="box">
                <div class="settings__options-container">

                    <div class="settings__option">
                        <div class="settings__option-name">
                            <span>
                                {{ translations.searchEngineSettingsFuzzyness }}
                            </span>
                            <span class="icon tooltip" :data-tooltip="translations.searchEngineSettingsFuzzynessDescription">
                                <i class="fa fa-info-circle"></i>
                            </span>
                        </div>
                        <div class="settings__option-content">
                            <div class="field is-grouped is-grouped-right vertical-center">
                                <div class="control">
                                    <input class="slider" type="range" min="0.01" max="1" step="0.01" v-model="config.searchEngineOptions.fuzzyness" @change="updateConfig">
                                </div>
                                <div class="control">
                                    <input class="input" type="number" min="0" max="1" step="0.05" v-model="config.searchEngineOptions.fuzzyness">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="settings__option">
                        <div class="settings__option-name">{{ translations.searchEngineSettingsMaxSearchResults }}</div>
                        <div class="settings__option-content">
                            <div class="field is-grouped is-grouped-right">
                                <div class="control">
                                    <input
                                        class="input"
                                        type="number"
                                        min="1"
                                        v-model="config.searchEngineOptions.maxSearchResults"
                                        @change="updateConfig"
                                        >
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="settings__option">
                        <div class="settings__option-name">{{ translations.searchEngineSettingsBlacklist }}</div>
                        <div class="settings__option-content">
                            <div class="field is-grouped is-grouped-right">
                                <ul v-if="config.searchEngineOptions.blackList.length > 0" class="has-text-right">
                                    <li v-for="(blackListEntry, index) in config.searchEngineOptions.blackList">
                                        <span class="tag">
                                            {{ blackListEntry }}
                                            <button class="delete is-small" @click="removeBlackListEntry(index)"></button>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div class="field has-addons has-addons-right">
                                <div class="control">
                                    <input type="text" class="input" v-model="newBlackListEntry">
                                </div>
                                <div class="control">
                                    <button class="button is-success" @click="addBlackListEntry">
                                        <span class="icon">
                                            <i class="fa fa-plus"></i>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>`,
});
