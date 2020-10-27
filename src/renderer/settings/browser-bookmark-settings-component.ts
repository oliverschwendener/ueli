import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { PluginSettings } from "./plugin-settings";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { defaultBrowserBookmarksOptions } from "../../common/config/browser-bookmarks-options";
import { deepCopy } from "../../common/helpers/object-helpers";
import { showNotification } from "../notifications";
import { NotificationType } from "../../common/notification-type";

export const browserBookmarkSettingsComponent = Vue.extend({
    data() {
        return {
            isVisible: false,
            settingName: PluginSettings.BrowserBookmarks,
        };
    },

    methods: {
        toggleEnabled() {
            const config: UserConfigOptions = this.config;
            config.browserBookmarksOptions.isEnabled = !config.browserBookmarksOptions.isEnabled;
            this.updateConfig();
        },

        resetAll() {
            const config: UserConfigOptions = this.config;
            config.browserBookmarksOptions = deepCopy(defaultBrowserBookmarksOptions);
            this.updateConfig();
        },

        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config);
        },

        removeBookmarkFile(bookmarkFile: string) {
            const config: UserConfigOptions = this.config;
            const indexToRemove = config.browserBookmarksOptions.bookmarksFiles.indexOf(bookmarkFile);
            config.browserBookmarksOptions.bookmarksFiles.splice(indexToRemove, 1);
            this.updateConfig();
        },

        onAddBookmarkFile() {
            vueEventDispatcher.$emit(VueEventChannels.openNewApplicationFolderModal);
        },

        addBookmarkFile(filePath: string) {
            const config: UserConfigOptions = this.config;
            const fileAlreadyExistsInList = config.browserBookmarksOptions.bookmarksFiles.find((a) => a === filePath) !== undefined;
            if (fileAlreadyExistsInList) {
                showNotification(`Folder "${filePath}" already exists in your list`, NotificationType.Info);
            } else {
                config.browserBookmarksOptions.bookmarksFiles.push(filePath);
                this.updateConfig();
            }
        }
    },

    props: ["config", "translations"],

    mounted() {
        vueEventDispatcher.$on(VueEventChannels.showSetting, (settingName: string) => {
            this.isVisible = settingName === this.settingName;
        });
        vueEventDispatcher.$on(VueEventChannels.bookmarksFileAdded, (filePath: string) => {
            this.addBookmarkFile(filePath);
        });
    },

    template: `
        <div v-if="isVisible">
            <div class="settings__setting-title title is-3">
                <span>
                    {{ translations.browserBookmarks }}
                </span>
                <div>
                    <plugin-toggle :is-enabled="config.browserBookmarksOptions.isEnabled" :toggled="toggleEnabled"/>
                    <button class="button" @click="resetAll">
                        <span class="icon">
                            <i class="fas fa-undo-alt"></i>
                        </span>
                    </button>
                </div>
            </div>
            <p class="settings__setting-description" v-html="translations.browserBookmarksDescription"></p>
            <div class="settings__setting-content">
                <div v-if="!config.browserBookmarksOptions.isEnabled" class="settings__setting-disabled-overlay"></div>
                <div class="settings__setting-content-item box">
                    <div class="table-container">
                        <table v-if="config.browserBookmarksOptions.bookmarksFiles.length > 0" class="table is-striped is-fullwidth">
                            <thead>
                                <tr>
                                    <th>{{ translations.browserBookmarksFile }}</th>
                                    <th class="has-text-right">{{ translations.browserBookmarkRemoveAction }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="bookmarksFile in config.browserBookmarksOptions.bookmarksFiles">
                                    <td>{{ bookmarksFile }}</td>
                                    <td class="has-text-right">
                                        <button class="button is-danger" @click="removeBookmarkFile(bookmarksFile)">
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
                        <button class="button is-success" @click="onAddBookmarkFile">
                            <span class="icon"><i class="fas fa-plus"></i></span>
                            <span>
                                {{ translations.browserBookmarksAddNewBookmarksFile }}
                            </span>
                        </button>
                    </div>
                    <div class="settings__option mt-4">
                            <div class="settings__option-name">{{ translations.browserBookmarksUseFavicons }}</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="control">
                                        <input id="useFaviconsCheckbox" type="checkbox" name="useFaviconsCheckbox" class="switch is-rounded is-success" checked="checked" v-model="config.browserBookmarksOptions.useFavicons" @change="updateConfig()">
                                        <label for="useFaviconsCheckbox"></label>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
            <new-bookmarks-file-modal :translations="translations"></new-bookmarks-file-modal>
        </div>
    `,
});
