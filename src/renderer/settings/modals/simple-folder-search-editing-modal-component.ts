import Vue from "vue";
import { vueEventDispatcher } from "../../vue-event-dispatcher";
import { VueEventChannels } from "../../vue-event-channels";
import {
    SimpleFolderSearchOptions,
    SimpleFolderSearchFolderOption,
} from "../../../common/config/simple-folder-search-options";
import { ModalEditMode } from "./modal-edit-mode";
import { NotificationType } from "../../../common/notification-type";
import { existsSync, lstatSync } from "fs";
import { getFolderPath } from "../../dialogs";
import { TranslationSet } from "../../../common/translation/translation-set";
import { homedir } from "os";
import { join } from "path";
import { deepCopy } from "../../../common/helpers/object-helpers";

const initialFolderOptions: SimpleFolderSearchFolderOption = {
    excludeHiddenFiles: false,
    folderPath: "",
    recursive: false,
};

const folderPathValidator = (folderPath: string): boolean => {
    return folderPath.length > 0 && existsSync(folderPath) && lstatSync(folderPath).isDirectory();
};

export const simpleFolderSearchEditingModalComponent = Vue.extend({
    data() {
        return {
            editMode: ModalEditMode.Add,
            options: deepCopy(initialFolderOptions),
            saveIndex: undefined,
            visible: false,
        };
    },
    methods: {
        getModalTitle(): string {
            const translations: TranslationSet = this.translations;
            const editMode: ModalEditMode = this.editMode;
            switch (editMode) {
                case ModalEditMode.Add:
                    return translations.simpleFolderSearchAddFolder;
                case ModalEditMode.Edit:
                    return translations.simpleFolderSearchEditFolder;
            }
        },
        closeModal() {
            this.editMode = ModalEditMode.Add;
            this.options = deepCopy(initialFolderOptions);
            this.saveIndex = 0;
            this.visible = false;
        },
        openFolderDialog() {
            getFolderPath()
                .then((folderPath) => {
                    const options: SimpleFolderSearchFolderOption = this.options;
                    options.folderPath = folderPath;
                })
                .catch((err) => {
                    // do nothing if no folder is selected
                });
        },
        saveButtonClick() {
            const options: SimpleFolderSearchFolderOption = this.options;
            if (folderPathValidator(options.folderPath)) {
                vueEventDispatcher.$emit(
                    VueEventChannels.simpleFolderSearchOptionSaved,
                    this.options,
                    this.editMode,
                    this.saveIndex,
                );
                this.closeModal();
            } else {
                vueEventDispatcher.$emit(VueEventChannels.notification, "Invalid folder path", NotificationType.Error);
            }
        },
        formIsValid(): boolean {
            const options: SimpleFolderSearchFolderOption = this.options;
            return folderPathValidator(options.folderPath);
        },
        getFolderPathPlaceholder(): string {
            const translations: TranslationSet = this.translations;
            return `${translations.forExample}: ${join(homedir(), "Downloads")}`;
        },
    },
    mounted() {
        vueEventDispatcher.$on(
            VueEventChannels.openSimpleFolderSearchEditingModal,
            (folderOptions?: SimpleFolderSearchOptions, editMode?: ModalEditMode, saveIndex?: number) => {
                if (editMode) {
                    this.editMode = editMode;
                }

                if (folderOptions) {
                    this.options = folderOptions;
                }

                if (saveIndex) {
                    this.saveIndex = saveIndex;
                }

                this.visible = true;
            },
        );
    },
    props: ["translations"],
    template: `
        <div class="modal" :class="{ 'is-active' : visible }">
            <div class="modal-background" @click="closeModal"></div>
            <div class="modal-content">
                <div class="message">
                    <div class="message-header">
                        <p>{{ getModalTitle() }}</p>
                        <button class="delete" @click="closeModal" aria-label="delete"></button>
                    </div>
                    <div class="message-body">
                        <div class="field">
                            <label class="label">
                                {{ translations.simpleFolderSearchFolderPath }}
                            </label>
                        </div>
                        <div class="field has-addons">
                            <div class="control is-expanded">
                                <input class="input" type="text" v-model="options.folderPath" :placeholder="getFolderPathPlaceholder()">
                            </div>
                            <div class="control">
                                <button class="button" @click="openFolderDialog" autofocus>
                                    <span class="icon">
                                        <i class="fas fa-folder"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">
                                {{ translations.simpleFolderSearchRecursive }}
                            </label>
                            <div class="control is-expanded">
                                <input class="is-checkradio" id="recursiveCheckbox" type="checkbox" name="recursiveCheckbox" v-model="options.recursive">
                                <label for="recursiveCheckbox"></label>
                                <div class="field">
                                    <input class="is-checkradio is-block is-success" id="recursiveCheckbox" type="checkbox" name="recursiveCheckbox" checked="checked">
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">
                                {{ translations.simpleFolderSearchExcludeHiddenFiles }}
                            </label>
                            <div class="control is-expanded">
                                <input class="is-checkradio" id="excludeHiddenFilexCheckbox" type="checkbox" name="excludeHiddenFilexCheckbox" v-model="options.excludeHiddenFiles">
                                <label for="excludeHiddenFilexCheckbox"></label>
                                <div class="field">
                                    <input class="is-checkradio is-block is-success" id="excludeHiddenFilexCheckbox" type="checkbox" name="excludeHiddenFilexCheckbox" checked="checked">
                                </div>
                            </div>
                        </div>
                        <div class="field is-grouped is-grouped-right">
                            <div class="control">
                                <button class="button is-danger" @click="closeModal">
                                    <span class="icon">
                                        <i class="fas fa-times"></i>
                                    </span>
                                    <span>
                                        {{ translations.cancel }}
                                    </span>
                                </button>
                                <button class="button is-success" :disabled="!formIsValid()" @click="saveButtonClick">
                                    <span class="icon">
                                        <i class="fas fa-check"></i>
                                    </span>
                                    <span>
                                        {{ translations.save }}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
});
