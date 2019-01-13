import Vue from "vue";
import { UserConfigOptions } from "../common/config/user-config-options";
import { VueEventChannels } from "./vue-event-channels";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { exists } from "fs";
import { FileHelpers } from "../main/helpers/file-helpers";
import { defaultApplicationSearchOptions } from "../main/plugins/application-search-plugin/default-application-search-plugin-options";

export const applicationSearchOptionsComponent = Vue.extend({
    data() {
        return {
            errorMessage: "",
            expanded: false,
            newApplicationFileExtension: "",
            newApplicationFolder: "",
        };
    },
    methods: {
        addApplicationFileExtension() {
            const config: UserConfigOptions = this.config;
            config.applicationSearchOptions.applicationFileExtensions.push(this.newApplicationFileExtension);
            this.newApplicationFileExtension = "";
            this.updateConfig();
        },
        addApplicationFolder() {
            const config: UserConfigOptions = this.config;
            config.applicationSearchOptions.applicationFolders.push(this.newApplicationFolder);
            this.newApplicationFolder = "";
            this.updateConfig();
        },
        onAddFileExtensionClick() {
            if (!this.newApplicationFileExtension.startsWith(".")) {
                this.handleError(`"${this.newApplicationFileExtension}" is not a valid file extension`);
            } else {
                this.addApplicationFileExtension();
            }
        },
        onAddFolderClick() {
            exists(this.newApplicationFolder, (folderExists) => {
                if (folderExists) {
                    FileHelpers.getStats(this.newApplicationFolder)
                        .then((stats) => {
                            if (stats.stats.isDirectory()) {
                                this.addApplicationFolder();
                            } else {
                                this.handleError(`"${this.newApplicationFolder}" is not a directory`);
                            }
                        });
                } else {
                    this.handleError(`The directory "${this.newApplicationFolder}" does not exist`);
                }
            });
        },
        removeApplicationFileExtension(applicationFileExtension: string) {
            const config: UserConfigOptions = this.config;
            const indexToRemove = config.applicationSearchOptions.applicationFileExtensions.indexOf(applicationFileExtension);
            config.applicationSearchOptions.applicationFileExtensions.splice(indexToRemove, 1);
            this.updateConfig();
        },
        removeApplicationFolder(applicationFolder: string) {
            const config: UserConfigOptions = this.config;
            const indexToRemove = config.applicationSearchOptions.applicationFolders.indexOf(applicationFolder);
            config.applicationSearchOptions.applicationFolders.splice(indexToRemove, 1);
            this.updateConfig();
        },
        resetApplicationFoldersToDefault() {
            let defaultApplicationFolders: string[] = [];
            defaultApplicationFolders = defaultApplicationFolders.concat(defaultApplicationSearchOptions.applicationFolders);
            const config: UserConfigOptions = this.config;
            config.applicationSearchOptions.applicationFolders = defaultApplicationFolders;
            this.updateConfig();
        },
        resetApplicationFileExtensionsToDefault() {
            let defaultApplicationFileExtensions: string[] = [];
            defaultApplicationFileExtensions = defaultApplicationFileExtensions.concat(defaultApplicationSearchOptions.applicationFileExtensions);
            const config: UserConfigOptions = this.config;
            config.applicationSearchOptions.applicationFileExtensions = defaultApplicationFileExtensions;
            this.updateConfig();
        },
        resetApplicationSearchOptionsToDefault() {
            this.resetApplicationFileExtensionsToDefault();
            this.resetApplicationFoldersToDefault();
            this.resetFallbackIconFilePathToDefault();
        },
        resetFallbackIconFilePathToDefault() {
            let defaultFallbackIconFilePath: string = "";
            defaultFallbackIconFilePath = `${defaultApplicationSearchOptions.fallbackIconFilePath}`;
            const config: UserConfigOptions = this.config;
            config.applicationSearchOptions.fallbackIconFilePath = defaultFallbackIconFilePath;
            this.updateConfig();
        },
        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config);
        },
        handleError(message: string) {
            vueEventDispatcher.$emit(VueEventChannels.settingsError, message);
        },
        settingsTitleClick() {
            this.expanded = !this.expanded;
        },
    },
    props: ["config"],
    template: `
        <div class="box">
            <div class="settings__setting-title">
                <span><i class="far fa-window-restore"></i> Application search</span>
                <div>
                    <button v-if="expanded" class="button is-small" @click="resetApplicationSearchOptionsToDefault"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                    <button class="button is-small" @click="settingsTitleClick"><span class="icon"><i :class="{ 'fas fa-minus' : expanded, 'fas fa-plus' : !expanded }"></i></span></button>
                </div>
            </div>
            <div class="settings__setting-content" :class="{ 'expanded' : expanded }">
                <div class="settings__setting-content-item">
                    <div class="settings__setting-content-item-title">
                        <span><i class="fas fa-folder"></i> Application folders</span>
                        <button class="button is-small" @click="resetApplicationFoldersToDefault"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                    </div>
                    <table class="table is-fullwidth is-striped is-bordered">
                        <tbody>
                            <tr v-for="applicationFolder in config.applicationSearchOptions.applicationFolders">
                                <td>
                                    <input readonly type="text" class="input is-small" v-model="applicationFolder">
                                </td>
                                <td>
                                    <button class="button is-danger is-small" @click="removeApplicationFolder(applicationFolder)">
                                        <span class="icon">
                                            <i class="fas fa-minus"></i>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="text" class="input is-small" v-model="newApplicationFolder">
                                </td>
                                <td>
                                    <button class="button is-primary is-small" @click="onAddFolderClick">
                                        <span class="icon">
                                            <i class="fas fa-plus"></i>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="settings__setting-content-item">
                    <div class="settings__setting-content-item-title">
                        <span>
                            <i class="fas fa-file"></i> Application file extensions
                        </span>
                        <button class="button is-small" @click="resetApplicationFileExtensionsToDefault"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                    </div>
                    <table class="table is-fullwidth is-striped is-bordered">
                        <tbody>
                            <tr v-for="applicationFileExtension in config.applicationSearchOptions.applicationFileExtensions">
                                <td>
                                    <input readonly type="text" class="input is-small" v-model="applicationFileExtension">
                                </td>
                                <td>
                                    <button class="button is-danger is-small" @click="removeApplicationFileExtension(applicationFileExtension)">
                                        <span class="icon">
                                            <i class="fas fa-minus"></i>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="text" class="input is-small" v-model="newApplicationFileExtension">
                                </td>
                                <td>
                                    <button class="button is-primary is-small" @click="onAddFileExtensionClick">
                                        <span class="icon">
                                            <i class="fas fa-plus"></i>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="settings__setting-content-item">
                    <div class="settings__setting-content-item-title">
                        <span>
                            <i class="fas fa-image"></i> Default app icon
                        </span>
                        <button class="button is-small" @click="resetFallbackIconFilePathToDefault"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                    </div>
                    <div class="field has-addons vertical-align">
                        <div class="settings__image-preview-container">
                            <img class="settings__image-preview" :src="config.applicationSearchOptions.fallbackIconFilePath">
                        </div>
                        <div class="control is-expanded">
                            <input type="text" class="input" v-model="config.applicationSearchOptions.fallbackIconFilePath">
                        </div>
                        <div class="control">
                            <button class="button is-primary" @click="updateConfig">
                                <span class="icon">
                                    <i class="fas fa-check"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
});
