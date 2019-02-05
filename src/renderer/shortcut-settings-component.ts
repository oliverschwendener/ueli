import Vue from "vue";
import { Settings } from "./settings";
import { defaultShortcutOptions, defaultShortcutIcon } from "../common/config/default-shortcuts-options";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";
import { UserConfigOptions } from "../common/config/user-config-options";
import { cloneDeep } from "lodash";
import { defaultNewShortcut } from "../main/plugins/shorcuts-plugin/shortcut-helpers";
import { IconType } from "../common/icon/icon-type";
import { ModalEditMode } from "./shortcut-editing-modal-component";
import { Shortcut } from "../main/plugins/shorcuts-plugin/shortcut";
import { Icon } from "../common/icon/icon";
import { IconHelpers } from "../common/icon/icon-helpers";
import { ShortcutType } from "../main/plugins/shorcuts-plugin/shortcut-type";

export const shortcutSettingsComponent = Vue.extend({
    data() {
        return {
            iconTypeSvg: IconType.SVG,
            iconTypeUrl: IconType.URL,
            settingName: Settings.Shortcuts,
            visible: false,
        };
    },
    methods: {
        addButtonClick() {
            vueEventDispatcher.$emit(VueEventChannels.openShortcutEditingModal, cloneDeep(defaultNewShortcut), ModalEditMode.Add);
        },
        addShortcut(shortcut: Shortcut) {
            const config: UserConfigOptions = this.config;
            config.shortcutOptions.shortcuts.push(cloneDeep(shortcut));
            this.updateConfig();
        },
        deleteShortcut(id: number) {
            const config: UserConfigOptions = this.config;
            config.shortcutOptions.shortcuts.splice(id, 1);
            this.updateConfig();
        },
        updateShortcut(shortcut: Shortcut, index: number) {
            const config: UserConfigOptions = cloneDeep(this.config);
            config.shortcutOptions.shortcuts[index] = cloneDeep(shortcut);
            this.config = cloneDeep(config);
            this.updateConfig();
        },
        editShortcut(index: number): void {
            const config: UserConfigOptions = this.config;
            const shortcut: Shortcut = cloneDeep(config.shortcutOptions.shortcuts[index]);
            vueEventDispatcher.$emit(VueEventChannels.openShortcutEditingModal, shortcut, ModalEditMode.Edit, index);
        },
        getShortcutIcon(shortcut: Shortcut): Icon {
            if (IconHelpers.isValidIcon(shortcut.icon)) {
                return shortcut.icon;
            } else {
                return defaultShortcutIcon;
            }
        },
        getShortcutTypeClass(shortcutType: ShortcutType): string {
            switch (shortcutType) {
                case ShortcutType.Url:
                    return "is-primary";
                case ShortcutType.FilePath:
                    return "is-info";
                default:
                    return "is-dark";
            }
        },
        resetAll() {
            const config: UserConfigOptions = this.config;
            config.shortcutOptions = cloneDeep(defaultShortcutOptions);
            this.updateConfig();
        },
        resetShortcutsToDefault() {
            const config: UserConfigOptions = this.config;
            config.shortcutOptions.shortcuts = cloneDeep(defaultShortcutOptions.shortcuts);
            this.updateConfig();
        },
        toggleEnabled() {
            const config: UserConfigOptions = this.config;
            config.shortcutOptions.isEnabled = !config.shortcutOptions.isEnabled;
            this.updateConfig();
        },
        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config);
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

        vueEventDispatcher.$on(VueEventChannels.shortcutEdited, (shortcut: Shortcut, editMode: ModalEditMode, saveIndex?: number) => {
            if (editMode === ModalEditMode.Add) {
                this.addShortcut(shortcut);
            } else if (editMode === ModalEditMode.Edit && saveIndex !== undefined) {
                this.updateShortcut(shortcut, saveIndex);
            }
        });
    },
    props: ["config"],
    template: `
        <div v-if="visible">
            <div class="settings__setting-title title is-3">
                <span>
                    Shortcut Options
                </span>
                <div>
                    <button class="button" :class="{ 'is-success' : config.shortcutOptions.isEnabled }" @click="toggleEnabled">
                        <span class="icon"><i class="fas fa-power-off"></i></span>
                    </button>
                    <button class="button" @click="resetAll">
                        <span class="icon"><i class="fas fa-undo-alt"></i></span>
                    </button>
                </div>
            </div>
            <div v-if="config.shortcutOptions.isEnabled" class="settings__setting-content box">
                <div class="settings__setting-content-item-title">
                    <div class="title is-5">Shortcuts</div>
                    <button class="button" @click="resetShortcutsToDefault"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                </div>
                <div v-if="config.shortcutOptions.shortcuts.length > 0" class="settings__setting-content-item">
                    <table class="table is-striped is-fullwidth">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Name</th>
                                <th class="is-expanded">Execution Argument</th>
                                <th>Description</th>
                                <th>Tags</th>
                                <th>Icon</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(shortcut, index) in config.shortcutOptions.shortcuts">
                                <td><span class="tag" :class="getShortcutTypeClass(shortcut.type)">{{ shortcut.type }}</span></td>
                                <td>{{ shortcut.name }}</td>
                                <td>{{ shortcut.executionArgument }}</td>
                                <td>{{ shortcut.description }}</td>
                                <td>
                                    <div v-if="shortcut.tags.length > 0" class="tags">
                                        <span v-for="tag in shortcut.tags" class="tag is-light">{{ tag }}</span>
                                    </div>
                                </td>
                                <td>
                                    <img v-if="getShortcutIcon(shortcut).type === iconTypeUrl" :src="getShortcutIcon(shortcut).parameter" class="settings-table__icon-url">
                                    <div v-else="getShortcutIcon(shortcut).type === iconTypeSvg" v-html="getShortcutIcon(shortcut).parameter" class="settings-table__icon-svg"></div>
                                </td>
                                <td><button class="button" @click="editShortcut(index)"><span class="icon"><i class="fas fa-edit"></i></span></button></td>
                                <td><button class="button is-danger" @click="deleteShortcut(index)"><span class="icon"><i class="fas fa-trash"></i></span></button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <button class="button is-success" @click="addButtonClick">
                        <span class="icon"><i class="fas fa-plus"></i></span>
                        <span>Add Shortcut</span>
                    </button>
                </div>
            </div>
            <div v-else>
                <h6 class="title is-6 has-text-danger">Shortcuts are disabled</h6>
            </div>
            <shortcut-editing-modal></shortcut-editing-modal>
        </div>
    `,
});
