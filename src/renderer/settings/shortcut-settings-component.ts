import Vue from "vue";
import { PluginSettings } from "./plugin-settings";
import { defaultShortcutOptions } from "../../common/config/shortcuts-options";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { UserConfigOptions } from "../../common/config/user-config-options";
import {
    defaultNewShortcut,
    getDefaultShortcutIcon,
} from "../../main/plugins/shortcuts-search-plugin/shortcut-helpers";
import { Shortcut } from "../../main/plugins/shortcuts-search-plugin/shortcut";
import { ShortcutType } from "../../main/plugins/shortcuts-search-plugin/shortcut-type";
import { ModalEditMode } from "./modals/modal-edit-mode";
import { TranslationSet } from "../../common/translation/translation-set";
import { UserConfirmationDialogParams, UserConfirmationDialogType } from "./modals/user-confirmation-dialog-params";
import { deepCopy } from "../../common/helpers/object-helpers";
import { Icon } from "../../common/icon/icon";

export const shortcutSettingsComponent = Vue.extend({
    data() {
        return {
            settingName: PluginSettings.Shortcuts,
            visible: false,
        };
    },
    methods: {
        addButtonClick() {
            vueEventDispatcher.$emit(
                VueEventChannels.openShortcutEditingModal,
                deepCopy(defaultNewShortcut),
                ModalEditMode.Add,
            );
        },
        addShortcut(shortcut: Shortcut) {
            const config: UserConfigOptions = this.config;
            config.shortcutOptions.shortcuts.push(deepCopy(shortcut));
            this.updateConfig();
        },
        deleteShortcut(id: number) {
            const config: UserConfigOptions = this.config;
            config.shortcutOptions.shortcuts.splice(id, 1);
            this.updateConfig();
        },
        updateShortcut(shortcut: Shortcut, index: number) {
            const config: UserConfigOptions = deepCopy(this.config);
            config.shortcutOptions.shortcuts[index] = deepCopy(shortcut);
            this.config = deepCopy(config);
            this.updateConfig();
        },
        editShortcut(index: number): void {
            const config: UserConfigOptions = this.config;
            const shortcut: Shortcut = deepCopy(config.shortcutOptions.shortcuts[index]);
            vueEventDispatcher.$emit(VueEventChannels.openShortcutEditingModal, shortcut, ModalEditMode.Edit, index);
        },
        getDefaultIcon(shortcut: Shortcut): Icon {
            return getDefaultShortcutIcon(shortcut);
        },
        getShortcutTypeIconClass(shorcutType: ShortcutType): string {
            switch (shorcutType) {
                case ShortcutType.Url:
                    return "fas fa-globe-europe";
                case ShortcutType.FilePath:
                    return "fas fa-file";
                case ShortcutType.CommandlineTool:
                    return "fas fa-terminal";
            }
        },
        getShortcutTypeClass(shortcutType: ShortcutType): string {
            switch (shortcutType) {
                case ShortcutType.Url:
                    return "is-primary";
                case ShortcutType.FilePath:
                    return "is-info";
                case ShortcutType.CommandlineTool:
                    return "is-link";
                default:
                    return "is-dark";
            }
        },
        resetAll() {
            const translations: TranslationSet = this.translations;
            const userConfirmationDialogParams: UserConfirmationDialogParams = {
                callback: () => {
                    const config: UserConfigOptions = this.config;
                    config.shortcutOptions = deepCopy(defaultShortcutOptions);
                    this.updateConfig();
                },
                message: translations.resetPluginSettingsToDefaultWarning,
                modalTitle: translations.resetToDefault,
                type: UserConfirmationDialogType.Default,
            };
            vueEventDispatcher.$emit(VueEventChannels.settingsConfirmation, userConfirmationDialogParams);
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

        vueEventDispatcher.$on(
            VueEventChannels.shortcutEdited,
            (shortcut: Shortcut, editMode: ModalEditMode, saveIndex?: number) => {
                if (editMode === ModalEditMode.Add) {
                    this.addShortcut(shortcut);
                } else if (editMode === ModalEditMode.Edit && saveIndex !== undefined) {
                    this.updateShortcut(shortcut, saveIndex);
                }
            },
        );
    },
    props: ["config", "translations"],
    template: `
        <div v-if="visible">
            <div class="settings__setting-title title is-3">
                <span>
                    {{ translations.shortcutSettings }}
                </span>
                <div>
                    <plugin-toggle :is-enabled="config.shortcutOptions.isEnabled" :toggled="toggleEnabled"/>
                    <button v-if="config.shortcutOptions.isEnabled" class="button" @click="resetAll">
                        <span class="icon"><i class="fas fa-undo-alt"></i></span>
                    </button>
                </div>
            </div>
            <p class="settings__setting-description" v-html="translations.shortcutSettingsDescription"></p>
            <div class="settings__setting-content">
                <div v-if="!config.shortcutOptions.isEnabled" class="settings__setting-disabled-overlay"></div>
                <div class="settings__setting-content-item box">
                    <div class="table-container">
                        <table class="table is-striped is-fullwidth" v-if="config.shortcutOptions.shortcuts.length > 0">
                            <thead>
                                <tr>
                                    <th>{{ translations.shortcutSettingsTableType }}</th>
                                    <th>{{ translations.shortcutSettingsTableName }}</th>
                                    <th class="is-expanded">{{ translations.shortcutSettingsTableExecutionArgument }}</th>
                                    <th>{{ translations.shortcutSettingsTableDescription }}</th>
                                    <th class="has-text-centered">{{ translations.shortcutSettingsNeedsUserConfirmation }}</th>
                                    <th>{{ translations.shortcutSettingsTableTags }}</th>
                                    <th class="has-text-centered">{{ translations.shortcutSettingsTableIcon }}</th>
                                    <th class="has-text-centered">{{ translations.shortcutSettingsTableEdit }}</th>
                                    <th class="has-text-centered">{{ translations.shortcutSettingsTableDelete }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(shortcut, index) in config.shortcutOptions.shortcuts">
                                    <td>
                                        <span class="tag" :class="getShortcutTypeClass(shortcut.type)">
                                            <span class="icon"><i :class="getShortcutTypeIconClass(shortcut.type)"></i></span>
                                        </span>
                                    </td>
                                    <td>{{ shortcut.name }}</td>
                                    <td>{{ shortcut.executionArgument }}</td>
                                    <td>{{ shortcut.description }}</td>
                                    <td class="has-text-centered"><i v-if="shortcut.needsUserConfirmationBeforeExecution" class="fas fa-check"></i></td>
                                    <td>
                                        <div v-if="shortcut.tags.length > 0" class="tags">
                                            <span v-for="tag in shortcut.tags" class="tag is-light">{{ tag }}</span>
                                        </div>
                                    </td>
                                    <td class="has-text-centered">
                                        <icon :icon="shortcut.icon" :defaulticon="getDefaultIcon(shortcut)"></icon>
                                    </td>
                                    <td class="has-text-centered">
                                        <button class="button" @click="editShortcut(index)">
                                            <span class="icon"><i class="fas fa-edit"></i></span>
                                        </button>
                                    </td>
                                    <td class="has-text-centered">
                                        <button class="button is-danger" @click="deleteShortcut(index)">
                                            <span class="icon"><i class="fas fa-trash"></i></span>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <button class="button is-success" @click="addButtonClick">
                            <span class="icon"><i class="fas fa-plus"></i></span>
                            <span>{{ translations.shortcutSettingsAddShortcut }}</span>
                        </button>
                    </div>
                </div>
            </div>
            <shortcut-editing-modal :translations="translations"></shortcut-editing-modal>
        </div>
    `,
});
