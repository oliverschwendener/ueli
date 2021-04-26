import Vue from "vue";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { VueEventChannels } from "../vue-event-channels";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { PluginSettings } from "./plugin-settings";
import { NotificationType } from "../../common/notification-type";
import { showNotification } from "../notifications";
import { UserConfirmationDialogParams, UserConfirmationDialogType } from "./modals/user-confirmation-dialog-params";
import { TranslationSet } from "../../common/translation/translation-set";
import { defaultApplicationSearchOptions } from "../../common/config/application-search-options";
import { deepCopy } from "../../common/helpers/object-helpers";
import { getCurrentOperatingSystem } from "../../common/helpers/operating-system-helpers";
import { platform } from "os";
import { PluginType } from "../../main/plugin-type";
import { OperatingSystem } from "../../common/operating-system";

const operatingSystem = getCurrentOperatingSystem(platform());

export const applicationSearchSettingsComponent = Vue.extend({
    data() {
        return {
            isWindows: operatingSystem === OperatingSystem.Windows,
            settingName: PluginSettings.ApplicationSearch,
            visible: false,
        };
    },
    methods: {
        addApplicationFileExtension(applicationFileExtension: string) {
            const config: UserConfigOptions = this.config;
            if (
                config.applicationSearchOptions.applicationFileExtensions.find(
                    (a) => a === applicationFileExtension,
                ) !== undefined
            ) {
                showNotification(`"${applicationFileExtension}" already exists in your list`, NotificationType.Info);
            } else {
                config.applicationSearchOptions.applicationFileExtensions.push(applicationFileExtension);
                this.updateConfig(true);
            }
        },
        addApplicationFolder(folderPath: string) {
            const config: UserConfigOptions = this.config;
            const folderAlreadyExistsInList =
                config.applicationSearchOptions.applicationFolders.find((a) => a === folderPath) !== undefined;
            if (folderAlreadyExistsInList) {
                showNotification(`Folder "${folderPath}" already exists in your list`, NotificationType.Info);
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
            const indexToRemove = config.applicationSearchOptions.applicationFileExtensions.indexOf(
                applicationFileExtension,
            );
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
            const translations: TranslationSet = this.translations;
            const userConfirmationDialogParams: UserConfirmationDialogParams = {
                callback: () => {
                    const config: UserConfigOptions = this.config;
                    config.applicationSearchOptions = deepCopy(defaultApplicationSearchOptions);
                    this.updateConfig(true);
                },
                message: translations.resetPluginSettingsToDefaultWarning,
                modalTitle: translations.resetToDefault,
                type: UserConfirmationDialogType.Default,
            };
            vueEventDispatcher.$emit(VueEventChannels.settingsConfirmation, userConfirmationDialogParams);
        },
        resetApplicationFoldersToDefault() {
            const config: UserConfigOptions = this.config;
            config.applicationSearchOptions.applicationFolders = deepCopy(
                defaultApplicationSearchOptions.applicationFolders,
            );
            this.updateConfig(true);
        },
        resetApplicationFileExtensionsToDefault() {
            const config: UserConfigOptions = this.config;
            config.applicationSearchOptions.applicationFileExtensions = deepCopy(
                defaultApplicationSearchOptions.applicationFileExtensions,
            );
            this.updateConfig(true);
        },
        updateConfig(needsIndexRefresh: boolean) {
            vueEventDispatcher.$emit(
                VueEventChannels.configUpdated,
                this.config,
                needsIndexRefresh,
                PluginType.ApplicationSearchPlugin,
            );
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
    props: ["config", "translations"],
    template: `
        <div v-if="visible">
            <div class="settings__setting-title title is-3">
                <span>
                    {{ translations.applicationSearchSettings }}
                </span>
                <div>
                    <plugin-toggle :is-enabled="config.applicationSearchOptions.enabled" :toggled="toggleEnabled"/>
                    <button v-if="config.applicationSearchOptions.enabled" class="button" @click="resetAll">
                        <span class="icon"><i class="fas fa-undo-alt"></i></span>
                    </button>
                </div>
            </div>
            <p class="settings__setting-description" v-html="translations.applicationSearchSettingsDescription"></p>
            <div class="settings__setting-content">
                <div v-if="!config.applicationSearchOptions.enabled" class="settings__setting-disabled-overlay"></div>
                <div class="settings__setting-content-item box">
                    <div class="settings__setting-content-item-title">
                        <div class="title is-5">
                            {{ translations.applicationSearchSettingsApplicationFolders }}
                        </div>
                        <button class="button" @click="resetApplicationFoldersToDefault"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                    </div>
                    <div class="table-container">
                        <table v-if="config.applicationSearchOptions.applicationFolders.length > 0" class="table is-striped is-fullwidth">
                            <thead>
                                <tr>
                                    <th>{{ translations.applicationSearchSettingsFolderPath }}</th>
                                    <th class="has-text-right">{{ translations.applicationSearchSettingsRemoveAction }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="applicationFolder in config.applicationSearchOptions.applicationFolders">
                                    <td>{{ applicationFolder }}</td>
                                    <td class="has-text-right">
                                        <button class="button is-danger" @click="removeApplicationFolder(applicationFolder)">
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
                        <button class="button is-success" @click="onAddFolderClick">
                            <span class="icon"><i class="fas fa-plus"></i></span>
                            <span>
                                {{ translations.applicationSearchSettingsAddApplicationFolder }}
                            </span>
                        </button>
                    </div>
                </div>
                <div class="settings__setting-content-item box" v-if="isWindows">
                    <div class="settings__setting-content-item-title">
                        <div class="title is-5">
                            {{ translations.applicationSearchSettingsApplicationFileExtensions }}
                        </div>
                        <button class="button" @click="resetApplicationFileExtensionsToDefault"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                    </div>
                    <div class="table-container">
                        <table class="table is-striped is-fullwidth">
                            <thead>
                                <tr>
                                    <th>{{ translations.applicationSearchSettingsApplicationFileExtension }}</th>
                                    <th class="has-text-right">{{ translations.applicationSearchSettingsRemoveAction }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="applicationFileExtension in config.applicationSearchOptions.applicationFileExtensions">
                                    <td>{{ applicationFileExtension }}</td>
                                    <td class="has-text-right">
                                        <button class="button is-danger" @click="removeApplicationFileExtension(applicationFileExtension)">
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
                        <button class="button is-success" @click="onAddFileExtensionClick">
                            <span class="icon"><i class="fas fa-plus"></i></span>
                            <span>{{ translations.applicationSearchSettingsAddApplicationFileExtension }}</span>
                        </button>
                    </div>
                </div>
                <div class="box">
                    <div class="settings__options-container">
                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.showFullFilePath }}</div>
                            <div class="settings__option-content">
                                <div class="field has-addons has-addons-right vertical-center">
                                    <div class="control">
                                        <input id="showFullFilePathCheckbox" type="checkbox" name="showFullFilePathCheckbox" class="switch is-rounded is-success" checked="checked" v-model="config.applicationSearchOptions.showFullFilePath" @change="updateConfig(false)">
                                        <label for="showFullFilePathCheckbox"></label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings__option">
                            <div class="settings__option-name">{{ translations.applicationSearchSettingsUseNativeIcons }}</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="control">
                                        <input id="useNativeIconsCheckbox" type="checkbox" name="useNativeIconsCheckbox" class="switch is-rounded is-success" checked="checked" v-model="config.applicationSearchOptions.useNativeIcons" @change="updateConfig(true)">
                                        <label for="useNativeIconsCheckbox"></label><input id="useNativeIconsCheckbox" type="checkbox" name="useNativeIconsCheckbox" class="switch is-rounded is-success" checked="checked" v-model="config.generalOptions.autostart" @change="updateConfig()">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <new-application-folder-modal :translations="translations"></new-application-folder-modal>
            <new-application-file-extension-modal :translations="translations"></new-application-file-extension-modal>
        </div>
    `,
});
