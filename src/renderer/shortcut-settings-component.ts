import Vue from "vue";
import { Settings } from "./settings";
import { defaultShortcutsOptions } from "../common/config/default-shortcuts-options";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";
import { UserConfigOptions } from "../common/config/user-config-options";
import { ShortcutType } from "../main/plugins/shorcuts-plugin/shortcut-type";
import { Shortcut } from "../main/plugins/shorcuts-plugin/shortcut";
import { IconType } from "../common/icon/icon-type";
import { ShortcutHelpers } from "../main/plugins/shorcuts-plugin/shortcut-helpers";
import { cloneDeep } from "lodash";
import { SettingsNotificationType } from "./settings-notification-type";

const defaultNewShortcut = {
    icon: {
        type: IconType.URL,
    },
    type: ShortcutType.Url,
} as Shortcut;

export const shortcutSettingsComponent = Vue.extend({
    data() {
        return {
            addNewModalVisible: false,
            iconTypeSvg: IconType.SVG,
            iconTypeUrl: IconType.URL,
            iconTypes: Object.values(IconType).sort(),
            newShortcut: cloneDeep(defaultNewShortcut),
            settingName: Settings.Shortcuts,
            shortcutTypes: Object.values(ShortcutType).sort(),
            visible: false,
        };
    },
    methods: {
        addNewShortcut() {
            let newShortcut: Shortcut = this.newShortcut;
            if (ShortcutHelpers.isValidShortcut(newShortcut)) {
                const config: UserConfigOptions = this.config;
                config.shortcutsOptions.shortcuts.push(newShortcut);
                newShortcut = cloneDeep(defaultNewShortcut);
                this.addNewModalVisible = false;
                this.updateConfig();
            } else {
                vueEventDispatcher.$emit(VueEventChannels.pushNotification, "Invalid shortcut", SettingsNotificationType.Error);
            }
        },
        addNewShortcutButtonClick() {
            this.addNewModalVisible = true;
        },
        closeAddNewShortcutModalButtonClick() {
            this.addNewModalVisible = false;
        },
        deleteShortcut(id: number) {
            const config: UserConfigOptions = this.config;
            config.shortcutsOptions.shortcuts.splice(id, 1);
            this.updateConfig();
        },
        onKeyUp(event: KeyboardEvent) {
            if (event.key === "Escape") {
                this.closeAddNewShortcutModalButtonClick();
            }
        },
        resetAll() {
            const config: UserConfigOptions = this.config;
            config.shortcutsOptions = cloneDeep(defaultShortcutsOptions);
            this.updateConfig();
        },
        toggleEnabled() {
            const config: UserConfigOptions = this.config;
            config.shortcutsOptions.isEnabled = !config.shortcutsOptions.isEnabled;
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
    },
    props: ["config"],
    template: `
        <div v-if="visible" @keyup="onKeyUp">
            <div class="settings__setting-title title is-3">
                <span>
                    Shortcut Options
                </span>
                <div>
                    <button class="button" :class="{ 'is-success' : config.shortcutsOptions.isEnabled }" @click="toggleEnabled">
                        <span class="icon"><i class="fas fa-power-off"></i></span>
                    </button>
                    <button class="button" @click="resetAll">
                        <span class="icon"><i class="fas fa-undo-alt"></i></span>
                    </button>
                </div>
            </div>
            <div v-if="config.shortcutsOptions.isEnabled" class="settings__setting-content box">
                <div v-if="config.shortcutsOptions.shortcuts.length > 0" class="settings__setting-content-item">
                    <table class="table is-striped is-fullwidth">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th class="is-expanded">Execution Argument</th>
                                <th>Type</th>
                                <th>Icon</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(shortcut, index) in config.shortcutsOptions.shortcuts">
                                <td>{{ shortcut.name }}</td>
                                <td>{{ shortcut.description }}</td>
                                <td>{{ shortcut.executionArgument }}</td>
                                <td>{{ shortcut.type }}</td>
                                <td><img v-if="shortcut.icon.type === iconTypeUrl" :src="shortcut.icon.parameter"><span v-else="shortcut.icon.type === iconTypeSvg" v-html="shortcut.icon.parameter"></span></td>
                                <td><button class="button"><span class="icon"><i class="fas fa-edit"></i></span></button></td>
                                <td><button class="button is-danger" @click="deleteShortcut(index)"><span class="icon"><i class="fas fa-trash"></i></span></button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <button class="button is-success" @click="addNewShortcutButtonClick"><span class="icon"><i class="fas fa-plus"></i></span></button>
                </div>
                <div class="modal" :class="{ 'is-active' : addNewModalVisible }">
                    <div class="modal-background"></div>
                    <div class="modal-content">
                        <div class="message">
                            <div class="message-header">
                                <p>Add new shortcut</p>
                                <button class="delete" aria-label="delete" @click="closeAddNewShortcutModalButtonClick"></button>
                            </div>
                            <div class="message-body">
                                <div class="field">
                                    <label class="label">Name</label>
                                    <div class="control">
                                        <input class="input" type="text" placeholder="Text input" v-model="newShortcut.name" autofocus>
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="label">Description</label>
                                    <div class="control">
                                        <input class="input" type="text" placeholder="Text input" v-model="newShortcut.description">
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="label">Execution Argument</label>
                                    <div class="control">
                                        <input class="input" type="text" placeholder="Text input" v-model="newShortcut.executionArgument">
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="label">Shortcut Type</label>
                                    <div class="control is-expanded">
                                        <div class="select is-fullwidth">
                                            <select v-model="newShortcut.type">
                                                <option v-for="shortcutType in shortcutTypes">{{ shortcutType }}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="label">Icon</label>
                                    <div class="field has-addons">
                                        <div class="control">
                                            <span class="select">
                                                <select v-model="newShortcut.icon.type">
                                                    <option v-for="iconType in iconTypes">{{ iconType }}</option>
                                                </select>
                                            </span>
                                        </div>
                                        <div class="control is-expanded">
                                            <input class="input" type="text" placeholder="Icon parameter" v-model="newShortcut.icon.parameter">
                                        </div>
                                    </div>
                                </div>
                                <div class="field"
                                    <div class="control">
                                        <button class="button is-success" @click="addNewShortcut">Add</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
});
