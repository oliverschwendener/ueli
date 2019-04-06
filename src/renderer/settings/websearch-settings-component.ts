import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { Settings } from "./settings";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { defaultWebSearchOptions, defaultWebSearchIcon } from "../../common/config/default-websearch-options";
import { cloneDeep } from "lodash";
import { defaultNewWebSearchEngine } from "../../main/plugins/websearch-plugin/web-search-helpers";
import { ModalEditMode } from "./modals/shortcut-editing-modal-component";
import { WebSearchEngine } from "../../main/plugins/websearch-plugin/web-search-engine";

export const webSearchSettingsComponent = Vue.extend({
    data() {
        return {
            defaultWebSearchIcon,
            settingName: Settings.WebSearch,
            visible: false,
        };
    },
    methods: {
        editWebsearchEngine(index: number) {
            const config: UserConfigOptions = this.config;
            const webSearchEngine = config.websearchOptions.webSearchEngines[index];
            vueEventDispatcher.$emit(VueEventChannels.openWebSearchEditingModal, cloneDeep(webSearchEngine), ModalEditMode.Edit, index);
        },
        onAddWebsearchEngineClick() {
            vueEventDispatcher.$emit(VueEventChannels.openWebSearchEditingModal, cloneDeep(defaultNewWebSearchEngine), ModalEditMode.Add);
        },
        resetAll() {
            const config: UserConfigOptions = this.config;
            config.websearchOptions = cloneDeep(defaultWebSearchOptions);
            this.updateConfig();
        },
        resetWebsearchEngines() {
            const config: UserConfigOptions = this.config;
            config.websearchOptions.webSearchEngines = cloneDeep(defaultWebSearchOptions.webSearchEngines);
            this.updateConfig();
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
            config.websearchOptions.webSearchEngines[index] = cloneDeep(websearchEngine);
            this.config = cloneDeep(config);
            this.updateConfig();
        },
        removeWebsearchEngine(index: number) {
            const config: UserConfigOptions = this.config;
            config.websearchOptions.webSearchEngines.splice(index, 1);
            this.updateConfig();
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.showSetting, (settingName: Settings) => {
            if (this.settingName === settingName) {
                this.visible = true;
            } else {
                this.visible = false;
            }
        });

        vueEventDispatcher.$on(VueEventChannels.websearchEngineEdited, (websearchEngine: WebSearchEngine, editMode: ModalEditMode, saveIndex?: number) => {
            if (editMode === ModalEditMode.Add) {
                this.addWebsearchEngine(websearchEngine);
            } else if (editMode === ModalEditMode.Edit) {
                this.updateWebsearchEngine(websearchEngine, saveIndex);
            }
        });
    },
    props: ["config", "translations"],
    template: `
    <div v-if="visible">
        <div class="settings__setting-title title is-3">
            <span>
                {{ translations.websearch }}
            </span>
            <div>
                <button class="button" :class="{ 'is-success' : config.websearchOptions.isEnabled }" @click="toggleEnabled">
                    <span class="icon"><i class="fas fa-power-off"></i></span>
                </button>
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
                    <button class="button" @click="resetWebsearchEngines">
                        <span class="icon">
                            <i class="fas fa-undo-alt"></i>
                        </span>
                    </button>
                </div>
                <div class="table-container">
                    <table v-if="config.websearchOptions.webSearchEngines.length > 0" class="table is-striped is-fullwidth">
                        <thead>
                            <tr>
                                <th>{{ translations.websearchName }}</th>
                                <th>{{ translations.websearchPrefix }}</th>
                                <th>{{ translations.websearchUrl }}</th>
                                <th class="has-text-centered">{{ translations.websearchIcon }}</th>
                                <th class="has-text-centered">{{ translations.websearchPriority }}</th>
                                <th class="has-text-centered">{{ translations.websearchIsFallback }}</th>
                                <th class="has-text-centered">{{ translations.websearchEncodeSearchTerm }}</th>
                                <th class="has-text-centered">{{ translations.edit }}</th>
                                <th class="has-text-centered">{{ translations.remove }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(websearchEngine, index) in config.websearchOptions.webSearchEngines">
                                <td>{{ websearchEngine.name }}</td>
                                <td class="font-mono">{{ websearchEngine.prefix }}</td>
                                <td>{{ websearchEngine.url }}</td>
                                <td class="has-text-centered"><icon :icon="websearchEngine.icon" :defaulticon="defaultWebSearchIcon"></icon></td>
                                <td class="has-text-centered">{{ websearchEngine.priority }}</td>
                                <td class="has-text-centered"><i v-if="websearchEngine.isFallback" class="fas fa-check"></i></td>
                                <td class="has-text-centered"><i v-if="websearchEngine.encodeSearchTerm" class="fas fa-check"></i></td>
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
                                            <i class="fas fa-minus"></i>
                                        </span>
                                    </button>
                                </td>
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
