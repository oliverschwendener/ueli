import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { PluginSettings } from "./plugin-settings";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { cloneDeep } from "lodash";
import { defaultSimpleFolderSearchOptions } from "../../common/config/default-simple-folder-search-options";
import { SimpleFolderSearchFolderOption } from "../../common/config/simple-folder-search-options";
import { ModalEditMode } from "./modals/modal-edit-mode";

export const simpleFolderSearchSettingsComponent = Vue.extend({
    data() {
        return {
            isVisible: false,
            settingName: PluginSettings.SimpleFolderSearch,
        };
    },
    methods: {
        addFolder() {
            vueEventDispatcher.$emit(VueEventChannels.openSimpleFolderSearchEditingModal);
        },
        editFolder(index: number) {
            const config: UserConfigOptions = this.config;
            const folderOptions = config.simpleFolderSearchOptions.folders[index];
            vueEventDispatcher.$emit(VueEventChannels.openSimpleFolderSearchEditingModal, folderOptions, ModalEditMode.Edit, index);
        },
        removeFolder(index: number) {
            const config: UserConfigOptions = this.config;
            config.simpleFolderSearchOptions.folders.splice(index, 1);
            this.updateConfig();
        },
        resetAll() {
            const config: UserConfigOptions = this.config;
            config.simpleFolderSearchOptions = cloneDeep(defaultSimpleFolderSearchOptions);
            this.updateConfig();
        },
        toggleEnabled() {
            const config: UserConfigOptions = this.config;
            config.simpleFolderSearchOptions.isEnabled = !config.simpleFolderSearchOptions.isEnabled;
            this.updateConfig();
        },
        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config, true);
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.showSetting, (settingName: string) => {
            if (settingName === this.settingName) {
                this.isVisible = true;
            } else {
                this.isVisible = false;
            }
        });

        vueEventDispatcher.$on(VueEventChannels.simpleFolderSearchOptionSaved, (folderOptions: SimpleFolderSearchFolderOption, editMode: ModalEditMode, saveIndex?: number) => {
            const config: UserConfigOptions = this.config;
            if (editMode === ModalEditMode.Edit) {
                if (saveIndex) {
                    config.simpleFolderSearchOptions.folders[saveIndex] = folderOptions;
                }
            } else if (editMode === ModalEditMode.Add) {
                config.simpleFolderSearchOptions.folders.push(folderOptions);
            }
            this.updateConfig();
        });
    },
    props: ["config", "translations"],
    template: `
        <div v-if="isVisible">
            <div class="settings__setting-title title is-3">
                <span>
                    {{ translations.simpleFolderSearch }}
                </span>
                <div>
                    <button class="button" :class="{ 'is-success' : config.simpleFolderSearchOptions.isEnabled }" @click="toggleEnabled">
                        <span class="icon">
                            <i class="fas fa-power-off"></i>
                        </span>
                    </button>
                    <button class="button" @click="resetAll">
                        <span class="icon"><i class="fas fa-undo-alt"></i></span>
                    </button>
                </div>
            </div>
            <p class="settings__setting-description" v-html="translations.simpleFolderSearchDescription"></p>
            <div class="settings__setting-content">

                <div class="box">
                    <div class="settings__options-container">
                        <div class="settings__option">
                            <div class="settings__option-name">Show full file path</div>
                            <div class="settings__option-content">
                                <div class="field has-addons has-addons-right vertical-center">
                                    <div class="control">
                                        <input id="showFullFilePathCheckbox" type="checkbox" name="showFullFilePathCheckbox" class="switch is-rounded is-success" checked="checked" v-model="config.simpleFolderSearchOptions.showFullFilePath" @change="updateConfig">
                                        <label for="showFullFilePathCheckbox"></label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="!config.simpleFolderSearchOptions.isEnabled" class="settings__setting-disabled-overlay"></div>
                <div class="settings__setting-content-item box">
                    <div class="table-container">
                        <table class="table is-striped is-fullwidth" v-if="config.simpleFolderSearchOptions.folders.length > 0">
                            <thead>
                                <tr>
                                    <th>{{ translations.simpleFolderSearchFolderPath }}</th>
                                    <th>{{ translations.simpleFolderSearchExcludeHiddenFiles }}</th>
                                    <th>{{ translations.simpleFolderSearchRecursive }}</th>
                                    <th class="has-text-centered">{{ translations.edit }}</th>
                                    <th class="has-text-centered">{{ translations.remove }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(folder, index) in config.simpleFolderSearchOptions.folders">
                                    <td>{{ folder.folderPath }}</td>
                                    <td class="has-text-centered"><i v-if="folder.recursive" class="fas fa-check"></i></td>
                                    <td class="has-text-centered"><i v-if="folder.excludeHiddenFiles" class="fas fa-check"></i></td>
                                    <td class="has-text-centered">
                                        <button class="button" @click="editFolder(index)">
                                            <span class="icon">
                                                <i class="fas fa-edit"></i>
                                            </span>
                                        </button>
                                    </td>
                                    <td class="has-text-centered">
                                        <button class="button is-danger" @click="removeFolder(index)">
                                            <span class="icon">
                                                <i class="fas fa-trash"></i>
                                            </span>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <button class="button is-success" @click="addFolder">
                            <span class="icon"><i class="fas fa-plus"></i></span>
                            <span>{{ translations.simpleFolderSearchAddFolder }}</span>
                        </button>
                    </div>
                </div>
            </div>
            <simple-folder-search-editing :translations="translations"></simple-folder-search-editing>
        </div>
    `,
});
