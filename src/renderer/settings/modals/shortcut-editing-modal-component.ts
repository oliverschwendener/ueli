import Vue from "vue";
import { vueEventDispatcher } from "../../vue-event-dispatcher";
import { VueEventChannels } from "../../vue-event-channels";
import { Shortcut } from "../../../main/plugins/shorcuts-search-plugin/shortcut";
import { ShortcutType } from "../../../main/plugins/shorcuts-search-plugin/shortcut-type";
import { IconType } from "../../../common/icon/icon-type";
import { platform, homedir } from "os";
import { cloneDeep } from "lodash";
import { defaultNewShortcut, ShortcutHelpers } from "../../../main/plugins/shorcuts-search-plugin/shortcut-helpers";
import { SettingsNotificationType } from "../settings-notification-type";
import { isValidWindowsFilePath, isValidMacOsFilePath } from "../../../common/helpers/file-path-validators";
import { isWindows } from "../../../common/helpers/operating-system-helpers";
import { isEqual } from "lodash";
import { showNotification } from "../../notifications";
import { getFileAndFolderPaths } from "../../dialogs";
import { TranslationSet } from "../../../common/translation/translation-set";
import { join } from "path";

export enum ModalEditMode {
    Edit = "Edit Shortcut",
    Add = "Add new Shortcut",
}

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
            iconTypeSvg: IconType.SVG,
            iconTypeUrl: IconType.URL,
            iconTypes: Object.values(IconType).sort(),
            newTag: "",
            saveIndex: undefined,
            shortcut: cloneDeep(defaultNewShortcut),
            shortcutTypeFilePath: ShortcutType.FilePath,
            shortcutTypeUrl: ShortcutType.Url,
            shortcutTypes: Object.values(ShortcutType).sort(),
            visible: false,
        };
    },
    methods: {
        saveButtonClick(): void {
            const translations: TranslationSet = this.translations;
            const filePathValidator = isWindows(platform()) ? isValidWindowsFilePath : isValidMacOsFilePath;
            if (ShortcutHelpers.isValidToAdd(this.shortcut, filePathValidator)) {
                vueEventDispatcher.$emit(VueEventChannels.shortcutEdited, this.shortcut, this.editMode, this.saveIndex);
                this.resetModal();
            } else {
                showNotification(translations.shortcutSettingsInvalidShortcutErrorMessage, SettingsNotificationType.Error);
            }
        },
        closeButtonClick() {
            this.shortcut = cloneDeep(defaultNewShortcut);
            this.visible = false;
        },
        deleteTag(index: number) {
            this.shortcut.tags.splice(index, 1);
        },
        getShortcutType(shortcutType: ShortcutType): string {
            const translations: TranslationSet = this.translations;
            switch (shortcutType) {
                case ShortcutType.Url:
                    return translations.shortcutSettingsTypeUrl;
                case ShortcutType.FilePath:
                    return translations.shortcutSettingsTypeFilePath;
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
                    return translations.shortcutSettingsEditModalFilePath;
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
                    placeholder = `${join(homedir(), "Downloads")}`;
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
                    placeholder = "Downloads";
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
        getTagsPlaceholder(): string {
            const translation: TranslationSet = this.translations;
            return translation.shortcutSettingsTagPlaceholder;
        },
        onBackgroundClick() {
            this.resetModal();
        },
        openFolderDialog() {
            getFileAndFolderPaths()
                .then((filePaths) => {
                    if (filePaths.length > 0) {
                        const shortcut: Shortcut = this.shortcut;
                        shortcut.executionArgument = filePaths[0];
                    }
                });
        },
        onTagKeyPress(event: KeyboardEvent) {
            if (event.key === "Enter") {
                if (this.newTag.length > 0) {
                    const shortcut: Shortcut = this.shortcut;
                    shortcut.tags.push(this.newTag);
                    this.newTag = "";
                }
            }
        },
        resetModal(): void {
            this.shortcut = cloneDeep(defaultNewShortcut);
            this.saveIndex = undefined;
            this.visible = false;
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.openShortcutEditingModal, (shortcut: Shortcut, editMode: ModalEditMode, saveIndex?: number) => {
            this.visible = true;
            this.editMode = editMode;
            this.shortcut = shortcut;
            this.initialShortcut = cloneDeep(shortcut);
            this.saveIndex = saveIndex;
            this.autofocus = true;
        });
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
                                <button class="button" @click="openFolderDialog" autofocus>
                                    <span class="icon"><i class="fas fa-folder"></i></span>
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
                                {{ translations.shortcutSettingsTableTags }}
                            </label>
                            <div v-if="shortcut.tags.length > 0" class="tags">
                                <span v-for="(tag, index) in shortcut.tags" class="tag is-dark">{{ tag }} <button @click="deleteTag(index)" class="delete is-small"></button></span>
                            </div>
                            <div class="control">
                                <input class="input" type="text" v-model="newTag" :placeholder="getTagsPlaceholder()" @keyup="onTagKeyPress">
                            </div>
                        </div>
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
