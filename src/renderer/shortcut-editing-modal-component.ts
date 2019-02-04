import Vue from "vue";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";
import { Shortcut } from "../main/plugins/shorcuts-plugin/shortcut";
import { ShortcutType } from "../main/plugins/shorcuts-plugin/shortcut-type";
import { IconType } from "../common/icon/icon-type";
import { platform } from "os";
import { cloneDeep } from "lodash";
import { defaultNewShortcut, ShortcutHelpers } from "../main/plugins/shorcuts-plugin/shortcut-helpers";
import { SettingsNotificationType } from "./settings-notification-type";
import { isValidWindowsFilePath, isValidMacOsFilePath } from "../common/helpers/file-path-validators";
import { isWindows } from "../common/helpers/operating-system-helpers";

export enum ModalEditMode {
    Edit = "Edit Shortcut",
    Add = "Add new Shortcut",
}

export const shortcutEditingModal = Vue.extend({
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
            shortcutTypes: Object.values(ShortcutType).sort(),
            visible: false,
        };
    },
    methods: {
        saveButtonClick(): void {
            const filePathValidator = isWindows(platform()) ? isValidWindowsFilePath : isValidMacOsFilePath;
            if (ShortcutHelpers.isValidToAdd(this.shortcut, filePathValidator)) {
                vueEventDispatcher.$emit(VueEventChannels.shortcutEdited, this.shortcut, this.editMode, this.saveIndex);
                this.resetModal();
            } else {
                vueEventDispatcher.$emit(VueEventChannels.pushNotification, "Invalid shortcut", SettingsNotificationType.Error);
            }
        },
        closeButtonClick() {
            this.shortcut = cloneDeep(defaultNewShortcut);
            this.visible = false;
        },
        deleteTag(index: number) {
            this.shortcut.tags.splice(index, 1);
        },
        getIconTypePlaceholder(iconType: IconType): string {
            return iconType === IconType.SVG
                ? "SVG String"
                : "Image URL";
        },
        getShorcutTypeDescriptionPlaceholder(shortcutType: ShortcutType): string {
            const placeholder = shortcutType === ShortcutType.Url
                ? "Google Website"
                : "Downloads Folder";
            return `For example: "${placeholder}"`;
        },
        getShorcutTypeExecutionArgumentDescription(shortcutType: ShortcutType): string {
            switch (shortcutType) {
                case ShortcutType.Url:
                    return "URL";
                case ShortcutType.FilePath:
                    return "File Path";
                default:
                    return "Execution Argument";
            }
        },
        getShorcutTypeExecutionArgumentPlaceholder(shortcutType: ShortcutType): string {
            const placeholder = shortcutType === ShortcutType.Url
                ? "https://google.com"
                : isWindows(platform())
                    ? "C:\\Users\\Downloads"
                    : "/Users/Foo/Downloads";
            return `For example: "${placeholder}"`;
        },
        getShorcutTypeNamePlaceholder(shortcutType: ShortcutType): string {
            const placeholder = shortcutType === ShortcutType.Url
                ? "Google"
                : "Downloads";
            return `For example: "${placeholder}"`;
        },
        onBackgroundClick() {
            this.resetModal();
        },
        onGlobalKeyPress(event: KeyboardEvent) {
            if (event.key === "Escape") {
                this.resetModal();
            }
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
            this.saveIndex = saveIndex;
            this.autofocus = true;
        });
    },
    template: `
        <div class="modal" :class="{ 'is-active' : visible }" @keyup="onGlobalKeyPress">
            <div class="modal-background" @click="onBackgroundClick"></div>
            <div class="modal-content">
                <div class="message">
                    <div class="message-header">
                        <p>{{ editMode }}</p>
                        <button class="delete" aria-label="delete" @click="closeButtonClick"></button>
                    </div>
                    <div class="message-body">
                        <div class="field">
                            <label class="label">Shortcut Type</label>
                            <div class="control is-expanded">
                                <div class="select is-fullwidth">
                                    <select v-model="shortcut.type" :autofocus="autofocus">
                                        <option v-for="shortcutType in shortcutTypes">{{ shortcutType }}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Name</label>
                            <div class="control">
                                <input class="input" type="text" :placeholder="getShorcutTypeNamePlaceholder(shortcut.type)" v-model="shortcut.name">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">{{ getShorcutTypeExecutionArgumentDescription(shortcut.type) }}</label>
                            <div class="control">
                                <input class="input" type="text" :placeholder="getShorcutTypeExecutionArgumentPlaceholder(shortcut.type)" v-model="shortcut.executionArgument">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Description (optional)</label>
                            <div class="control">
                                <input class="input" type="text" :placeholder="getShorcutTypeDescriptionPlaceholder(shortcut.type)" v-model="shortcut.description">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Tags (optional)</label>
                            <div v-if="shortcut.tags.length > 0" class="tags">
                                <span v-for="(tag, index) in shortcut.tags" class="tag is-dark">{{ tag }} <button @click="deleteTag(index)" class="delete is-small"></button></span>
                            </div>
                            <div class="control">
                                <input class="input" type="text" v-model="newTag" placeholder="Add a tag and press Enter" @keyup="onTagKeyPress">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Icon (optional)</label>
                            <div class="field has-addons">
                                <div class="control">
                                    <span class="select">
                                        <select v-model="shortcut.icon.type">
                                            <option v-for="iconType in iconTypes">{{ iconType }}</option>
                                        </select>
                                    </span>
                                </div>
                                <div class="control is-expanded">
                                    <input class="input" type="text" :placeholder="getIconTypePlaceholder(shortcut.icon.type)" v-model="shortcut.icon.parameter">
                                </div>
                            </div>
                        </div>
                        <div class="field"
                            <div class="control">
                                <button class="button is-success" @click="saveButtonClick">
                                    </span class="icon"><i class="far fa-save"></i></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
});
