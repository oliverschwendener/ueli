import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { PluginSettings } from "./plugin-settings";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { defaultSimpleFolderSearchOptions } from "../../common/config/simple-folder-search-options";
import { SimpleFolderSearchFolderOption } from "../../common/config/simple-folder-search-options";
import { ModalEditMode } from "./modals/modal-edit-mode";
import { TranslationSet } from "../../common/translation/translation-set";
import { UserConfirmationDialogParams, UserConfirmationDialogType } from "./modals/user-confirmation-dialog-params";
import { deepCopy } from "../../common/helpers/object-helpers";
import { PluginType } from "../../main/plugin-type";

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
            vueEventDispatcher.$emit(
                VueEventChannels.openSimpleFolderSearchEditingModal,
                folderOptions,
                ModalEditMode.Edit,
                index,
            );
        },
        removeFolder(index: number) {
            const config: UserConfigOptions = this.config;
            config.simpleFolderSearchOptions.folders.splice(index, 1);
            this.updateConfig(true);
        },
        resetAll() {
            const translations: TranslationSet = this.translations;
            const userConfirmationDialogParams: UserConfirmationDialogParams = {
                callback: () => {
                    const config: UserConfigOptions = this.config;
                    config.simpleFolderSearchOptions = deepCopy(defaultSimpleFolderSearchOptions);
                    this.updateConfig(true);
                },
                message: translations.resetPluginSettingsToDefaultWarning,
                modalTitle: translations.resetToDefault,
                type: UserConfirmationDialogType.Default,
            };
            vueEventDispatcher.$emit(VueEventChannels.settingsConfirmation, userConfirmationDialogParams);
        },
        toggleEnabled() {
            const config: UserConfigOptions = this.config;
            config.simpleFolderSearchOptions.isEnabled = !config.simpleFolderSearchOptions.isEnabled;
            this.updateConfig(true);
        },
        updateConfig(forceRefreshIndex: boolean) {
            vueEventDispatcher.$emit(
                VueEventChannels.configUpdated,
                this.config,
                forceRefreshIndex,
                PluginType.SimpleFolderSearch,
            );
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

        vueEventDispatcher.$on(
            VueEventChannels.simpleFolderSearchOptionSaved,
            (folderOptions: SimpleFolderSearchFolderOption, editMode: ModalEditMode, saveIndex?: number) => {
                const config: UserConfigOptions = this.config;
                if (editMode === ModalEditMode.Edit) {
                    if (saveIndex) {
                        config.simpleFolderSearchOptions.folders[saveIndex] = folderOptions;
                    }
                } else if (editMode === ModalEditMode.Add) {
                    config.simpleFolderSearchOptions.folders.push(folderOptions);
                }
                this.updateConfig(true);
            },
        );
    },
    props: ["config", "translations"],
    template: `
        <div v-if="isVisible">
            <div class="settings__setting-title title is-3">
                <span>
                    {{ translations.simpleFolderSearch }}
                </span>
                <div>
                    <plugin-toggle :is-enabled="config.simpleFolderSearchOptions.isEnabled" :toggled="toggleEnabled"/>
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
                            <div class="settings__option-name">{{ translations.showFullFilePath }}</div>
                            <div class="settings__option-content">
                                <div class="field has-addons has-addons-right vertical-center">
                                    <div class="control">
                                        <input id="showFullFilePathCheckbox" type="checkbox" name="showFullFilePathCheckbox" class="switch is-rounded is-success" checked="checked" v-model="config.simpleFolderSearchOptions.showFullFilePath" @change="updateConfig(false)">
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
                                    <th>{{ translations.simpleFolderSearchRecursive }}</th>
                                    <th>{{ translations.simpleFolderSearchExcludeHiddenFiles }}</th>
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
