import Vue from "vue";
import { vueEventDispatcher } from "../../vue-event-dispatcher";
import { VueEventChannels } from "../../vue-event-channels";
import { FileHelpers } from "../../../common/helpers/file-helpers";
import { NotificationType } from "../../../common/notification-type";
import { getFolderPath } from "../../dialogs";
import { showNotification } from "../../notifications";
import { getCurrentOperatingSystem } from "../../../common/helpers/operating-system-helpers";
import { platform } from "os";
import { TranslationSet } from "../../../common/translation/translation-set";
import { OperatingSystem } from "../../../common/operating-system";

const operatingSystem = getCurrentOperatingSystem(platform());

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
        getPlaceholder(): string {
            const translations: TranslationSet = this.translations;
            const folderPath =
                operatingSystem === OperatingSystem.Windows
                    ? "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs"
                    : "/Applications";

            return `${translations.forExample}: "${folderPath}"`;
        },
        openFolderDialog() {
            getFolderPath().then((folderPath) => {
                this.newApplicationFolder = folderPath;
            });
        },
        saveButtonClick() {
            const validator: (filePath: string) => Promise<void> = this.validateFolderPath;
            validator(this.newApplicationFolder)
                .then(() => {
                    vueEventDispatcher.$emit(VueEventChannels.applicationFolderAdded, this.newApplicationFolder);
                    this.closeModal();
                })
                .catch((err: string) => showNotification(err, NotificationType.Error));
        },
        validateFolderPath(folderPath: string): Promise<void> {
            const translations: TranslationSet = this.translations;
            const notAFolderError = translations.applicationSearchSettingsNotAFolderErrorMessage.replace(
                "{{value}}",
                folderPath,
            );
            const folderDoesNotExistError = translations.applicationSearchSettingsDoesNotExistErrorMessage.replace(
                "{{value}}",
                folderPath,
            );
            const genericError = translations.applicationSearchSettingsFolderValidationError.replace(
                "{{value}}",
                folderPath,
            );

            return new Promise((resolve, reject) => {
                FileHelpers.fileExists(folderPath)
                    .then((fileExists) => {
                        if (fileExists.fileExists) {
                            FileHelpers.getStats(folderPath)
                                .then((stats) => {
                                    if (stats.stats.isDirectory()) {
                                        resolve();
                                    } else {
                                        reject(notAFolderError);
                                    }
                                })
                                .catch((err) => reject(err));
                        } else {
                            reject(folderDoesNotExistError);
                        }
                    })
                    .catch(() => reject(genericError));
            });
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.openNewApplicationFolderModal, () => {
            this.visible = true;
        });
    },
    props: ["translations"],
    template: `
        <div class="modal" :class="{ 'is-active' : visible }">
            <div class="modal-background" @click="closeModal"></div>
            <div class="modal-content">
                <div class="message">
                    <div class="message-header">
                        <p>{{ translations.applicationSearchSettingsAddApplicationFolder }}</p>
                        <button @click="closeModal" class="delete" aria-label="delete"></button>
                    </div>
                    <div class="message-body">
                        <div class="field">
                            <label class="label">
                                {{ translations.applicationSearchSettingsApplicationFolder }}
                            </label>
                        </div>
                        <div class="field has-addons">
                            <div class="control is-expanded">
                                <input class="input" type="text" v-model="newApplicationFolder" :placeholder="getPlaceholder()">
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
                                    <span>{{ translations.cancel }}</span>
                                </button>
                            </div>
                            <div class="control">
                                <button :disabled="newApplicationFolder.length === 0" class="button is-success" @click="saveButtonClick">
                                    <span class="icon">
                                        <i class="fas fa-check"></i>
                                    </span>
                                    <span>{{ translations.save }}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
});
