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
                this.updateConfig();
            } else {
                vueEventDispatcher.$emit(VueEventChannels.pushNotification, "Invalid shortcut", SettingsNotificationType.Error);
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
        <div v-if="visible" class="">
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
            <div v-if="config.shortcutsOptions.isEnabled" class="settings__setting-content">
                <div v-for="shortcut in config.shortcutsOptions.shortcuts" class="settings__setting-content-item box">
                    <div class="columns is-vcentered">
                        <div class="column is-one-fifth"><h6 class="title is-6">Name</h6></div>
                        <div class="column field has-addons">
                            <div class="control is-expanded">
                                <input class="input" type="text" v-model="shortcut.name">
                            </div>
                            <div class="control is-four-fifths">
                                <button class="button is-success" @click="updateConfig">
                                    <span class="icon"><i class="fas fa-check"></i></span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="columns is-vcentered">
                        <div class="column is-one-fifth"><h6 class="title is-6">Description</h6></div>
                        <div class="column is-four-fifths field has-addons">
                            <div class="control is-expanded">
                                <input class="input" type="text" v-model="shortcut.description">
                            </div>
                            <div class="control">
                                <button class="button is-success" @click="updateConfig">
                                    <span class="icon"><i class="fas fa-check"></i></span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="columns is-vcentered">
                        <div class="column is-one-fifth"><h6 class="title is-6">Execution Argument</h6></div>
                        <div class="column field has-addons">
                            <div class="control is-expanded">
                                <input class="input" type="text" v-model="shortcut.executionArgument">
                            </div>
                            <div class="control">
                                <button class="button is-success" @click="updateConfig">
                                    <span class="icon"><i class="fas fa-check"></i></span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="columns is-vcentered">
                        <div class="column is-one-fifth"><h6 class="title is-6">Icon</h6></div>
                        <div class="column field has-addons">
                            <div class="control is-expanded">
                                <input class="input" type="text" v-model="shortcut.icon.parameter">
                            </div>
                            <div class="control">
                                <div class="select">
                                    <select v-model="shortcut.icon.type">
                                        <option v-for="iconType in iconTypes">{{ iconType }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="control">
                                <button class="button is-success" @click="updateConfig">
                                    <span class="icon"><i class="fas fa-check"></i></span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="columns is-vcentered">
                        <div class="column is-one-fifth"><h6 class="title is-6">Shortcut Type</h6></div>
                        <div class="column field has-addons">
                            <div class="control is-expanded">
                                <div class="select is-fullwidth">
                                    <select v-model="shortcut.type">
                                        <option v-for="type in shortcutTypes">{{ type }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="control">
                                <button class="button is-success" @click="updateConfig">
                                    <span class="icon"><i class="fas fa-check"></i></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="settings__setting-content-item box">
                    <div class="columns is-vcentered">
                        <div class="column is-one-fifth"><h6 class="title is-6">Name</h6></div>
                        <div class="column control is-expanded">
                            <input class="input" type="text" v-model="newShortcut.name">
                        </div>
                    </div>
                    <div class="columns is-vcentered">
                        <div class="column is-one-fifth"><h6 class="title is-6">Description</h6></div>
                        <div class="column control is-expanded">
                            <input class="input" type="text" v-model="newShortcut.description">
                        </div>
                    </div>
                    <div class="columns is-vcentered">
                        <div class="column is-one-fifth"><h6 class="title is-6">Execution Argument</h6></div>
                        <div class="column control is-expanded">
                            <input class="input" type="text" v-model="newShortcut.executionArgument">
                        </div>
                    </div>
                    <div class="columns is-vcentered">
                        <div class="column is-one-fifth"><h6 class="title is-6">Type</h6></div>
                        <div class="column control is-expanded">
                            <div class="select is-fullwidth">
                                <select v-model="newShortcut.type">
                                    <option v-for="type in shortcutTypes">{{ type }}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="columns is-vcentered">
                        <div class="column is-one-fifth"><h6 class="title is-6">Icon</h6></div>
                        <div class="column field has-addons">
                            <div class="control is-expanded">
                                <input class="input" type="text" v-model="newShortcut.icon.parameter">
                            </div>
                            <div class="control">
                                <div class="select">
                                    <select v-model="newShortcut.icon.type">
                                        <option v-for="iconType in iconTypes"">{{ iconType }}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="field is-grouped">
                        <div class="control">
                            <button class="button is-success" @click="addNewShortcut">Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
});
