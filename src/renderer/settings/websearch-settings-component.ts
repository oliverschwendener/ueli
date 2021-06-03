import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { PluginSettings } from "./plugin-settings";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { defaultWebSearchOptions } from "../../common/config/websearch-options";
import { defaultNewWebSearchEngine } from "../../main/plugins/websearch-plugin/web-search-helpers";
import { WebSearchEngine } from "../../main/plugins/websearch-plugin/web-search-engine";
import { ModalEditMode } from "./modals/modal-edit-mode";
import { defaultWebSearchIcon } from "../../common/icon/default-icons";
import { TranslationSet } from "../../common/translation/translation-set";
import { UserConfirmationDialogParams, UserConfirmationDialogType } from "./modals/user-confirmation-dialog-params";
import { deepCopy } from "../../common/helpers/object-helpers";

export const webSearchSettingsComponent = Vue.extend({
    data() {
        return {
            defaultWebSearchIcon,
            settingName: PluginSettings.WebSearch,
            visible: false,
        };
    },
    methods: {
        editWebsearchEngine(index: number) {
            const config: UserConfigOptions = this.config;
            const webSearchEngine = config.websearchOptions.webSearchEngines[index];
            vueEventDispatcher.$emit(
                VueEventChannels.openWebSearchEditingModal,
                deepCopy(webSearchEngine),
                ModalEditMode.Edit,
                index,
            );
        },
        onAddWebsearchEngineClick() {
            vueEventDispatcher.$emit(
                VueEventChannels.openWebSearchEditingModal,
                deepCopy(defaultNewWebSearchEngine),
                ModalEditMode.Add,
            );
        },
        resetAll() {
            const translations: TranslationSet = this.translations;
            const userConfirmationDialogParams: UserConfirmationDialogParams = {
                callback: () => {
                    const config: UserConfigOptions = this.config;
                    config.websearchOptions = deepCopy(defaultWebSearchOptions);
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
            config.websearchOptions.isEnabled = !config.websearchOptions.isEnabled;
            this.updateConfig();
        },
        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config);
        },
        addWebsearchEngine(websearchEngine: WebSearchEngine) {
            const config: UserConfigOptions = this.config;
            config.websearchOptions.webSearchEngines.push(websearchEngine);
            this.updateConfig();
        },
        updateWebsearchEngine(websearchEngine: WebSearchEngine, index: number) {
            const config: UserConfigOptions = this.config;
            config.websearchOptions.webSearchEngines[index] = deepCopy(websearchEngine);
            this.config = deepCopy(config);
            this.updateConfig();
        },
        removeWebsearchEngine(index: number) {
            const config: UserConfigOptions = this.config;
            config.websearchOptions.webSearchEngines.splice(index, 1);
            this.updateConfig();
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.showSetting, (settingName: PluginSettings) => {
            if (this.settingName === settingName) {
                this.visible = true;
            } else {
                this.visible = false;
            }
        });

        vueEventDispatcher.$on(
            VueEventChannels.websearchEngineEdited,
            (websearchEngine: WebSearchEngine, editMode: ModalEditMode, saveIndex?: number) => {
                if (editMode === ModalEditMode.Add) {
                    this.addWebsearchEngine(websearchEngine);
                } else if (editMode === ModalEditMode.Edit) {
                    this.updateWebsearchEngine(websearchEngine, saveIndex);
                }
            },
        );
    },
    props: ["config", "translations"],
    template: `
    <div v-if="visible">
        <div class="settings__setting-title title is-3">
            <span>
                {{ translations.websearch }}
            </span>
            <div>
                <plugin-toggle :is-enabled="config.websearchOptions.isEnabled" :toggled="toggleEnabled"/>
                <button v-if="config.websearchOptions.isEnabled" class="button" @click="resetAll">
                    <span class="icon"><i class="fas fa-undo-alt"></i></span>
                </button>
            </div>
        </div>
        <p class="settings__setting-description" v-html="translations.websearchSettingDescription"></p>
        <div class="settings__setting-content">
            <div v-if="!config.websearchOptions.isEnabled" class="settings__setting-disabled-overlay"></div>
            <div class="settings__setting-content-item box">
                <div class="settings__setting-content-item-title">
                    <div class="title is-5">
                        {{ translations.websearchEngines }}
                    </div>
                </div>
                <div class="table-container">
                    <table v-if="config.websearchOptions.webSearchEngines.length > 0" class="table is-striped is-fullwidth">
                        <thead>
                            <tr>
                                <th class="has-text-centered">{{ translations.edit }}</th>
                                <th class="has-text-centered">{{ translations.remove }}</th>
                                <th>{{ translations.websearchName }}</th>
                                <th>{{ translations.websearchPrefix }}</th>
                                <th>{{ translations.websearchUrl }}</th>
                                <th>{{ translations.websearchSuggestionUrl }}</th>
                                <th class="has-text-centered">{{ translations.websearchIcon }}</th>
                                <th class="has-text-centered">{{ translations.websearchPriority }}</th>
                                <th class="has-text-centered">{{ translations.websearchIsFallback }}</th>
                                <th class="has-text-centered">{{ translations.websearchEncodeSearchTerm }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(websearchEngine, index) in config.websearchOptions.webSearchEngines">
                                <td class="has-text-centered">
                                    <button class="button" @click="editWebsearchEngine(index)">
                                        <span class="icon">
                                            <i class="fas fa-edit"></i>
                                        </span>
                                    </button>
                                </td>
                                <td class="has-text-centered">
                                    <button class="button is-danger" @click="removeWebsearchEngine(index)">
                                        <span class="icon">
                                            <i class="fas fa-trash"></i>
                                        </span>
                                    </button>
                                </td>
                                <td>{{ websearchEngine.name }}</td>
                                <td class="font-mono">{{ websearchEngine.prefix }}</td>
                                <td>{{ websearchEngine.url }}</td>
                                <td>{{ websearchEngine.suggestionUrl }}</td>
                                <td class="has-text-centered"><icon :icon="websearchEngine.icon" :defaulticon="defaultWebSearchIcon"></icon></td>
                                <td class="has-text-centered">{{ websearchEngine.priority }}</td>
                                <td class="has-text-centered"><i v-if="websearchEngine.isFallback" class="fas fa-check"></i></td>
                                <td class="has-text-centered"><i v-if="websearchEngine.encodeSearchTerm" class="fas fa-check"></i></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <button class="button is-success" @click="onAddWebsearchEngineClick">
                        <span class="icon"><i class="fas fa-plus"></i></span>
                        <span>
                            Add new websearch engine
                        </span>
                    </button>
                </div>
            </div>

        </div>
        <websearch-editing-modal :translations="translations"></websearch-editing-modal>
    </div>
    `,
});
