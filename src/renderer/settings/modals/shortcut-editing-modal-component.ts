import Vue from "vue";
import { vueEventDispatcher } from "../../vue-event-dispatcher";
import { VueEventChannels } from "../../vue-event-channels";
import { Shortcut } from "../../../main/plugins/shortcuts-search-plugin/shortcut";
import { ShortcutType } from "../../../main/plugins/shortcuts-search-plugin/shortcut-type";
import { platform, homedir } from "os";
import {
    defaultNewShortcut,
    isValidShortcutToAdd,
} from "../../../main/plugins/shortcuts-search-plugin/shortcut-helpers";
import { NotificationType } from "../../../common/notification-type";
import { isValidWindowsFilePath, isValidMacOsFilePath } from "../../../common/helpers/file-path-validators";
import { getCurrentOperatingSystem } from "../../../common/helpers/operating-system-helpers";
import { showNotification } from "../../notifications";
import { getFilePath, getFolderPath } from "../../dialogs";
import { TranslationSet } from "../../../common/translation/translation-set";
import { join } from "path";
import { ModalEditMode } from "./modal-edit-mode";
import { deepCopy, isEqual } from "../../../common/helpers/object-helpers";
import { OperatingSystem } from "../../../common/operating-system";

const operatingSystem = getCurrentOperatingSystem(platform());

export const shortcutEditingModal = Vue.extend({
    computed: {
        noChanges(): boolean {
            return isEqual(this.initialShortcut, this.shortcut);
        },
    },
    data() {
        return {
            autofocus: true,
            editMode: ModalEditMode.Add,
            saveIndex: undefined,
            shortcut: deepCopy(defaultNewShortcut),
            shortcutTypeFilePath: ShortcutType.FilePath,
            shortcutTypeUrl: ShortcutType.Url,
            shortcutTypes: Object.values(ShortcutType).sort(),
            visible: false,
        };
    },
    methods: {
        saveButtonClick(): void {
            const translations: TranslationSet = this.translations;
            const filePathValidator =
                operatingSystem === OperatingSystem.Windows ? isValidWindowsFilePath : isValidMacOsFilePath;
            if (isValidShortcutToAdd(this.shortcut, filePathValidator)) {
                vueEventDispatcher.$emit(VueEventChannels.shortcutEdited, this.shortcut, this.editMode, this.saveIndex);
                this.resetModal();
            } else {
                showNotification(translations.shortcutSettingsInvalidShortcutErrorMessage, NotificationType.Error);
            }
        },
        closeButtonClick() {
            this.shortcut = deepCopy(defaultNewShortcut);
            this.visible = false;
        },
        getShortcutType(shortcutType: ShortcutType): string {
            const translations: TranslationSet = this.translations;
            switch (shortcutType) {
                case ShortcutType.Url:
                    return translations.shortcutSettingsTypeUrl;
                case ShortcutType.FilePath:
                    return translations.filePath;
                case ShortcutType.CommandlineTool:
                    return translations.shortcutSettingsTypeCommandlineTool;
            }
        },
        getModalTitle(): string {
            const translations: TranslationSet = this.translations;
            const editMode: ModalEditMode = this.editMode;
            return editMode === ModalEditMode.Add
                ? translations.shortcutSettingsAddShortcut
                : translations.shortcutSettingsTableEdit;
        },
        getShorcutTypeDescriptionPlaceholder(shortcutType: ShortcutType): string {
            const translations: TranslationSet = this.translations;
            let placeholder = "";
            switch (shortcutType) {
                case ShortcutType.Url:
                    placeholder = translations.shortcutSettingsEditModalGoogleWebsite;
                    break;
                case ShortcutType.FilePath:
                    placeholder = translations.shortcutSettingsEditModalDownloadsFolder;
                    break;
                case ShortcutType.CommandlineTool:
                    placeholder = translations.shortcutSettingsEditModalCommandLinetoolDescription;
                    break;
            }
            return `${translations.forExample}: "${placeholder}"`;
        },
        getShorcutTypeExecutionArgumentDescription(shortcutType: ShortcutType): string {
            const translations: TranslationSet = this.translations;
            switch (shortcutType) {
                case ShortcutType.Url:
                    return "URL";
                case ShortcutType.FilePath:
                    return translations.filePath;
                case ShortcutType.CommandlineTool:
                    return translations.shortcutSettingsEditModalCommand;
                default:
                    return translations.shortcutSettingsTableExecutionArgument;
            }
        },
        getShorcutTypeExecutionArgumentPlaceholder(shortcutType: ShortcutType): string {
            const translations: TranslationSet = this.translations;
            let placeholder = "";
            switch (shortcutType) {
                case ShortcutType.FilePath:
                    placeholder = `${join(homedir(), "Downloads", "file.txt")}`;
                    break;
                case ShortcutType.Url:
                    placeholder = "https://google.com";
                    break;
                case ShortcutType.CommandlineTool:
                    placeholder = `code ${join(homedir(), "file.txt")}`;
                    break;
            }
            return `${translations.forExample}: "${placeholder}"`;
        },
        getShorcutTypeNamePlaceholder(shortcutType: ShortcutType): string {
            const translations: TranslationSet = this.translations;
            let placeholder = "";
            switch (shortcutType) {
                case ShortcutType.FilePath:
                    placeholder = "file.txt";
                    break;
                case ShortcutType.Url:
                    placeholder = "Google";
                    break;
                case ShortcutType.CommandlineTool:
                    placeholder = "file.txt";
                    break;
            }
            return `${translations.forExample}: "${placeholder}"`;
        },
        onBackgroundClick() {
            this.resetModal();
        },
        openFile() {
            getFilePath()
                .then((filePath) => this.handleFileOrFolderSelected(filePath))
                .catch((err) => {
                    /* do nothing if no file selected */
                });
        },
        openFolder() {
            getFolderPath()
                .then((folderPath) => this.handleFileOrFolderSelected(folderPath))
                .catch((err) => {
                    /* do nothing if no folder selected */
                });
        },
        handleFileOrFolderSelected(filePath: string) {
            const shortcut: Shortcut = this.shortcut;
            shortcut.executionArgument = filePath;
        },
        resetModal(): void {
            this.shortcut = deepCopy(defaultNewShortcut);
            this.saveIndex = undefined;
            this.visible = false;
        },
    },
    mounted() {
        vueEventDispatcher.$on(
            VueEventChannels.openShortcutEditingModal,
            (shortcut: Shortcut, editMode: ModalEditMode, saveIndex?: number) => {
                this.visible = true;
                this.editMode = editMode;
                this.shortcut = shortcut;
                this.initialShortcut = deepCopy(shortcut);
                this.saveIndex = saveIndex;
                this.autofocus = true;
            },
        );
    },
    props: ["translations"],
    template: `
        <div class="modal" :class="{ 'is-active' : visible }">
            <div class="modal-background" @click="onBackgroundClick"></div>
            <div class="modal-content">
                <div class="message">
                    <div class="message-header">
                        <p>{{ getModalTitle() }}</p>
                        <button class="delete" aria-label="delete" @click="closeButtonClick"></button>
                    </div>
                    <div class="message-body">
                        <div class="field">
                            <label class="label">
                                {{ translations.shortcutSettingsTableType }}
                            </label>
                            <div class="control is-expanded">
                                <div class="select is-fullwidth">
                                    <select v-model="shortcut.type" :autofocus="autofocus">
                                        <option v-for="shortcutType in shortcutTypes" :value="shortcutType">
                                            {{ getShortcutType(shortcutType) }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">
                                {{ translations.shortcutSettingsTableName }}
                            </label>
                            <div class="control">
                                <input class="input" type="text" :placeholder="getShorcutTypeNamePlaceholder(shortcut.type)" v-model="shortcut.name">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">{{ getShorcutTypeExecutionArgumentDescription(shortcut.type) }}</label>
                        </div>
                        <div class="field" :class="{ 'has-addons' : shortcut.type === shortcutTypeFilePath }">
                            <div class="control is-expanded">
                                <input class="input" type="text" :placeholder="getShorcutTypeExecutionArgumentPlaceholder(shortcut.type)" v-model="shortcut.executionArgument">
                            </div>
                            <div v-if="shortcut.type === shortcutTypeFilePath" class="control">
                                <button class="button" @click="openFile" autofocus>
                                    <span class="icon tooltip" :data-tooltip="translations.chooseFile">
                                        <i class="fas fa-file"></i>
                                    </span>
                                </button>
                            </div>
                            <div v-if="shortcut.type === shortcutTypeFilePath" class="control">
                                <button class="button" @click="openFolder" autofocus>
                                    <span class="icon tooltip" :data-tooltip="translations.chooseFolder">
                                        <i  class="fas fa-folder"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">
                                {{ translations.shortcutSettingsTableDescription }}
                            </label>
                            <div class="control">
                                <input class="input" type="text" :placeholder="getShorcutTypeDescriptionPlaceholder(shortcut.type)" v-model="shortcut.description">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">
                                {{ translations.shortcutSettingsNeedsUserConfirmation }}
                            </label>
                            <div class="control">
                                <input class="is-checkradio" id="userConfirmationCheckbox" type="checkbox" name="userConfirmationCheckbox" v-model="shortcut.needsUserConfirmationBeforeExecution">
                                <label for="userConfirmationCheckbox"></label>
                                <div class="field">
                                    <input class="is-checkradio is-block is-success" id="userConfirmationCheckbox" type="checkbox" name="userConfirmationCheckbox" checked="checked">
                                </div>
                            </div>
                        </div>
                        <tags-editing :tags="shortcut.tags" :field-title="translations.shortcutSettingsTableTags" :translations="translations"></tags-editing>
                        <icon-editing :icon="shortcut.icon" :translations="translations"></icon-editing>
                        <div class="field is-grouped is-grouped-right">
                            <div class="control">
                                <button class="button is-danger" @click="closeButtonClick">
                                    <span class="icon">
                                        <i class="fas fa-times"></i>
                                    </span>
                                    <span>{{ translations.cancel }}</span>
                                </button>
                            </div>
                            <div class="control">
                                <button :disabled="noChanges" class="button is-success" @click="saveButtonClick">
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
