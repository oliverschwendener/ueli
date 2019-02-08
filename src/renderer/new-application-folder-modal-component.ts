import Vue from "vue";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";
import { FileHelpers } from "../main/helpers/file-helpers";
import { SettingsNotificationType } from "./settings-notification-type";
import { getFolderPaths } from "./dialogs";

export const newApplicationFolderModalComponent = Vue.extend({
    data() {
        return {
            newApplicationFolder: "",
            visible: false,
        };
    },
    methods: {
        closeModal() {
            this.visible = false;
            this.newApplicationFolder = "";
        },
        openFolderDialog() {
            getFolderPaths()
                .then((folderPaths) => {
                    if (folderPaths.length > 0) {
                        this.newApplicationFolder = folderPaths[0];
                    }
                });
        },
        saveButtonClick() {
            const validator: (filePath: string) => Promise<void> = this.validateFolderPath;
            validator(this.newApplicationFolder)
                .then(() => {
                    vueEventDispatcher.$emit(VueEventChannels.applicationFolderAdded, this.newApplicationFolder);
                    this.closeModal();
                })
                .catch((err: string) => {
                    vueEventDispatcher.$emit(VueEventChannels.pushNotification, err, SettingsNotificationType.Error);
                });
        },
        validateFolderPath(folderPath: string): Promise<void> {
            return new Promise((resolve, reject) => {
                FileHelpers.fileExists(folderPath)
                    .then((fileExists) => {
                        if (fileExists) {
                            FileHelpers.getStats(folderPath)
                                .then((stats) => {
                                    if (stats.stats.isDirectory()) {
                                        resolve();
                                    } else {
                                        reject("Specified path is not a folder");
                                    }
                                })
                                .catch((err) => reject(err));
                        } else {
                            reject("Folder does not exist");
                        }
                    })
                    .catch(() => reject(`Error while trying to validate folder path: ${folderPath}`));
            });
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.openNewApplicationFolderModal, () => {
            this.visible = true;
        });
    },
    template: `
        <div class="modal" :class="{ 'is-active' : visible }">
            <div class="modal-background" @click="closeModal"></div>
            <div class="modal-content">
                <div class="message">
                    <div class="message-header">
                        <p>Add new application folder</p>
                        <button @click="closeModal" class="delete" aria-label="delete"></button>
                    </div>
                    <div class="message-body">
                        <div class="field">
                            <label class="label">
                                Application folder path
                            </label>
                        </div>
                        <div class="field has-addons">
                            <div class="control is-expanded">
                                <input class="input" type="text" v-model="newApplicationFolder">
                            </div>
                            <div class="control">
                                <button class="button" @click="openFolderDialog" autofocus>
                                    <span class="icon"><i class="fas fa-folder"></i></span>
                                </button>
                            </div>
                        </div>
                        <div class="field is-grouped is-grouped-right">
                            <div class="control">
                                <button class="button is-danger" @click="closeModal">
                                    <span class="icon">
                                        <i class="fas fa-times"></i>
                                    </span>
                                    <span>Cancel</span>
                                </button>
                            </div>
                            <div class="control">
                                <button class="button is-success" @click="saveButtonClick">
                                    <span class="icon">
                                        <i class="fas fa-check"></i>
                                    </span>
                                    <span>Save</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="closeModal"></button>
        </div>
    `,
});
