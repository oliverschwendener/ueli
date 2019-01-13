import Vue from "vue";
import { UserConfigOptions } from "../common/config/user-config-options";
import { VueEventChannels } from "./vue-event-channels";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { exists } from "fs";
import { FileHelpers } from "../main/helpers/file-helpers";

export const applicationSearchOptionsComponent = Vue.extend({
    data() {
        return {
            errorMessage: "",
            expanded: false,
            newApplicationFolder: "",
        };
    },
    methods: {
        addApplicationFolder() {
            const config: UserConfigOptions = this.config;
            config.applicationSearchOptions.applicationFolders.push(this.newApplicationFolder);
            this.newApplicationFolder = "";
            this.updateConfig();
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
                    this.handleError(`"${this.newApplicationFolder}" does not exist`);
                }
            });
        },
        removeApplicationFolder(applicationFolder: string) {
            const config: UserConfigOptions = this.config;
            const indexToRemove = config.applicationSearchOptions.applicationFolders.indexOf(applicationFolder);
            config.applicationSearchOptions.applicationFolders.splice(indexToRemove, 1);
            this.updateConfig();
        },
        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config);
        },
        handleError(message: string) {
            this.errorMessage = message;
            setTimeout(() => this.errorMessage = "", 2500);
        },
        settingsTitleClick() {
            this.expanded = !this.expanded;
        },
    },
    props: ["config"],
    template: `
        <div class="settings__setting-container">
            <div class="settings__setting-title" @click="settingsTitleClick">Application search</div>
            <div class="settings__setting-content" :class="{ 'expanded' : expanded }">
                <table>
                    <tbody>
                        <tr v-for="applicationFolder in config.applicationSearchOptions.applicationFolders">
                            <td>
                                <input type="text" v-model="applicationFolder" disabled>
                            </td>
                            <td>
                                <button @click="removeApplicationFolder(applicationFolder)">Remove</button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input v-model="newApplicationFolder">
                            </td>
                            <td>
                                <button @click="onAddFolderClick">Add</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="" v-if="errorMessage.length > 0">{{ errorMessage }}</div>
            </div>
        </div>
    `,
});
