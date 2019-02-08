import Vue from "vue";
import { UserConfigOptions } from "../common/config/user-config-options";
import { VueEventChannels } from "./vue-event-channels";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { defaultApplicationSearchOptions } from "../main/plugins/application-search-plugin/default-application-search-plugin-options";
import { cloneDeep } from "lodash";
import { Settings } from "./settings";
import { SettingsNotificationType } from "./settings-notification-type";
import { showNotification } from "./notifications";

export const applicationSearchSettingsComponent = Vue.extend({
    data() {
        return {
            settingName: Settings.ApplicationSearch,
            visible: false,
        };
    },
    methods: {
        addApplicationFileExtension(applicationFileExtension: string) {
            const config: UserConfigOptions = this.config;
            if (config.applicationSearchOptions.applicationFileExtensions.find((a) => a === applicationFileExtension) !== undefined) {
                showNotification(`"${applicationFileExtension}" already exists in your list`, SettingsNotificationType.Info);
            } else {
                config.applicationSearchOptions.applicationFileExtensions.push(applicationFileExtension);
                this.updateConfig(true);
            }
        },
        addApplicationFolder(folderPath: string) {
            const config: UserConfigOptions = this.config;
            const folderAlreadyExistsInList = config.applicationSearchOptions.applicationFolders.find((a) => a === folderPath) !== undefined;
            if (folderAlreadyExistsInList) {
                showNotification(`Folder "${folderPath}" already exists in your list`, SettingsNotificationType.Info);
            } else {
                config.applicationSearchOptions.applicationFolders.push(folderPath);
                this.updateConfig(true);
            }
        },
        onAddFileExtensionClick() {
            vueEventDispatcher.$emit(VueEventChannels.openNewApplicationFileExtensionModal);
        },
        onAddFolderClick() {
            vueEventDispatcher.$emit(VueEventChannels.openNewApplicationFolderModal);
        },
        toggleEnabled() {
            const config: UserConfigOptions = this.config;
            config.applicationSearchOptions.enabled = !config.applicationSearchOptions.enabled;
            this.updateConfig(true);
        },
        removeApplicationFileExtension(applicationFileExtension: string) {
            const config: UserConfigOptions = this.config;
            const indexToRemove = config.applicationSearchOptions.applicationFileExtensions.indexOf(applicationFileExtension);
            config.applicationSearchOptions.applicationFileExtensions.splice(indexToRemove, 1);
            this.updateConfig(true);
        },
        removeApplicationFolder(applicationFolder: string) {
            const config: UserConfigOptions = this.config;
            const indexToRemove = config.applicationSearchOptions.applicationFolders.indexOf(applicationFolder);
            config.applicationSearchOptions.applicationFolders.splice(indexToRemove, 1);
            this.updateConfig(true);
        },
        resetAll() {
            const config: UserConfigOptions = this.config;
            config.applicationSearchOptions = cloneDeep(defaultApplicationSearchOptions);
            this.updateConfig(true);
        },
        resetApplicationFoldersToDefault() {
            const config: UserConfigOptions = this.config;
            config.applicationSearchOptions.applicationFolders = cloneDeep(defaultApplicationSearchOptions.applicationFolders);
            this.updateConfig(true);
        },
        resetApplicationFileExtensionsToDefault() {
            const config: UserConfigOptions = this.config;
            config.applicationSearchOptions.applicationFileExtensions = cloneDeep(defaultApplicationSearchOptions.applicationFileExtensions);
            this.updateConfig(true);
        },
        updateConfig(needsIndexRefresh: boolean) {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config, needsIndexRefresh);
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

        vueEventDispatcher.$on(VueEventChannels.applicationFolderAdded, (folderPath: string) => {
            this.addApplicationFolder(folderPath);
        });

        vueEventDispatcher.$on(VueEventChannels.applicationFileExtensionAdded, (applicationFileExtension: string) => {
            this.addApplicationFileExtension(applicationFileExtension);
        });
    },
    props: ["config"],
    template: `
        <div v-if="visible">
            <div class="settings__setting-title title is-3">
                <span>
                    Application Search
                </span>
                <div>
                    <button class="button" :class="{ 'is-success' : config.applicationSearchOptions.enabled }" @click="toggleEnabled">
                        <span class="icon"><i class="fas fa-power-off"></i></span>
                    </button>
                    <button v-if="config.applicationSearchOptions.enabled" class="button" @click="resetAll">
                        <span class="icon"><i class="fas fa-undo-alt"></i></span>
                    </button>
                </div>
            </div>
            <div class="settings__setting-content">
                <div class="settings__setting-content-item box" v-if="config.applicationSearchOptions.enabled">
                    <div class="settings__setting-content-item-title">
                        <div class="title is-5">Application folders</div>
                        <button class="button" @click="resetApplicationFoldersToDefault"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                    </div>
                    <table v-if="config.applicationSearchOptions.applicationFolders.length > 0" class="table is-striped is-fullwidth">
                        <thead>
                            <tr>
                                <th>Folder path</th>
                                <th class="has-text-right">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="applicationFolder in config.applicationSearchOptions.applicationFolders">
                                <td>{{ applicationFolder }}</td>
                                <td class="has-text-right">
                                    <button class="button is-danger" @click="removeApplicationFolder(applicationFolder)">
                                        <span class="icon">
                                            <i class="fas fa-minus"></i>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                        <button class="button is-success" @click="onAddFolderClick">
                            <span class="icon"><i class="fas fa-plus"></i></span>
                            <span>Add application folder</span>
                        </button>
                    </div>
                </div>
                <div class="settings__setting-content-item box" v-if="config.applicationSearchOptions.enabled">
                    <div class="settings__setting-content-item-title">
                        <div class="title is-5">Application file extensions</div>
                        <button class="button" @click="resetApplicationFileExtensionsToDefault"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                    </div>
                    <table class="table is-striped is-fullwidth">
                        <thead>
                            <tr>
                                <th>Application file extension</th>
                                <th class="has-text-right">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="applicationFileExtension in config.applicationSearchOptions.applicationFileExtensions">
                                <td>{{ applicationFileExtension }}</td>
                                <td class="has-text-right">
                                    <button class="button is-danger" @click="removeApplicationFileExtension(applicationFileExtension)">
                                        <span class="icon">
                                            <i class="fas fa-minus"></i>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                        <button class="button is-success" @click="onAddFileExtensionClick">
                            <span class="icon"><i class="fas fa-plus"></i></span>
                            <span>Add application file extension</span>
                        </button>
                    </div>
                </div>
                <h6 v-else class="title is-6 has-text-danger">Application search is disabled</h6>
            </div>
            <new-application-folder-modal></new-application-folder-modal>
            <new-application-file-extension-modal></new-application-file-extension-modal>
        </div>
    `,
});
