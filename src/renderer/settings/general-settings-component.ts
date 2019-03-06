import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { cloneDeep } from "lodash";
import { defaultGeneralOptions } from "../../common/config/default-general-options";
import { Settings } from "./settings";
import { GlobalHotKeyModifier } from "../../common/global-hot-key/global-hot-key-modifier";
import { GlobalHotKeyKey } from "../../common/global-hot-key/global-hot-key-key";
import { Language } from "../../common/translation/language";

export const generalSettingsComponent = Vue.extend({
    data() {
        return {
            availableLanguages: Object.values(Language).map((l) => l),
            globalHotKeyKeys: Object.values(GlobalHotKeyKey).map((k) => k),
            globalHotKeyModifiers: Object.values(GlobalHotKeyModifier).map((m) => m),
            settingName: Settings.General,
            visible: false,
        };
    },
    methods: {
        resetAll() {
            const config: UserConfigOptions = this.config;
            config.generalOptions = cloneDeep(defaultGeneralOptions);
            this.updateConfig();
        },
        resetLanguage() {
            const config: UserConfigOptions = this.config;
            config.generalOptions.language = defaultGeneralOptions.language;
            this.updateConfig();
        },
        resetAutostart() {
            const config: UserConfigOptions = this.config;
            config.generalOptions.autostart = defaultGeneralOptions.autostart;
            this.updateConfig();
        },
        resetShowTrayIcon() {
            const config: UserConfigOptions = this.config;
            config.generalOptions.showTrayIcon = defaultGeneralOptions.showTrayIcon;
            this.updateConfig();
        },
        resetClearCachesOnExit() {
            const config: UserConfigOptions = this.config;
            config.generalOptions.clearCachesOnExit = defaultGeneralOptions.clearCachesOnExit;
            this.updateConfig();
        },
        resetHotKey() {
            const config: UserConfigOptions = this.config;
            config.generalOptions.hotKey = defaultGeneralOptions.hotKey;
            this.updateConfig();
        },
        resetRescanInterval() {
            const config: UserConfigOptions = this.config;
            config.generalOptions.rescanIntervalInSeconds = defaultGeneralOptions.rescanIntervalInSeconds;
            this.updateConfig();
        },
        resetShowAlwaysOnPrimaryDisplay() {
            const config: UserConfigOptions = this.config;
            config.generalOptions.showAlwaysOnPrimaryDisplay = defaultGeneralOptions.showAlwaysOnPrimaryDisplay;
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
    props: ["config", "translations"],
    template: `
        <div v-if="visible">
            <div class="settings__setting-title title is-3">
                <span>
                    {{ translations.generalSettings }}
                </span>
                <button class="button" @click="resetAll">
                    <span class="icon"><i class="fas fa-undo-alt"></i></span>
                </button>
            </div>
            <div class="settings__setting-content">

                <div class="settings__setting-content-item box">
                    <div class="settings__setting-content-item-title">
                        <div class="title is-5">
                            {{ translations.generalSettingsLanguage }}
                        </div>
                        <button class="button" @click="resetLanguage"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                    </div>
                    <div class="columns">
                        <div class="column field has-addons">
                            <div class="control is-expanded">
                                <div class="select is-fullwidth">
                                    <select v-model="config.generalOptions.language">
                                        <option v-for="availableLanguage in availableLanguages">{{ availableLanguage }}</option>
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
                    <div class="settings__setting-content-item-title">
                        <div class="title is-5">
                            {{ translations.generalSettingsAutostartApp }}
                        </div>
                        <button class="button" @click="resetAutostart"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                    </div>
                    <div class="columns">
                        <div class="column field has-addons">
                            <div class="control is-expanded">
                                <input class="is-checkradio" id="autoStartCheckbox" type="checkbox" name="autoStartCheckbox" v-model="config.generalOptions.autostart" @change="updateConfig">
                                <label for="autoStartCheckbox"></label>
                                <div class="field">
                                    <input class="is-checkradio is-block is-success" id="autoStartCheckbox" type="checkbox" name="autoStartCheckbox" checked="checked">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings__setting-content-item box">
                    <div class="settings__setting-content-item-title">
                        <div class="title is-5">
                            {{ translations.generalSettingsShowTrayIcon }}
                        </div>
                        <button class="button" @click="resetShowTrayIcon"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                    </div>
                    <div class="columns">
                        <div class="column field has-addons">
                            <div class="control is-expanded">
                                <input class="is-checkradio" id="showTrayIconCheckbox" type="checkbox" name="showTrayIconCheckbox" v-model="config.generalOptions.showTrayIcon" @change="updateConfig">
                                <label for="showTrayIconCheckbox"></label>
                                <div class="field">
                                    <input class="is-checkradio is-block is-success" id="showTrayIconCheckbox" type="checkbox" name="showTrayIconCheckbox" checked="checked">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings__setting-content-item box">
                    <div class="settings__setting-content-item-title">
                        <div class="title is-5">
                            {{ translations.generalSettingsClearCachesOnExit }}
                        </div>
                        <button class="button" @click="resetClearCachesOnExit"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                    </div>
                    <div class="columns">
                        <div class="column field has-addons">
                            <div class="control is-expanded">
                                <input class="is-checkradio" id="clearCachesOnExit" type="checkbox" name="clearCachesOnExit" v-model="config.generalOptions.clearCachesOnExit" @change="updateConfig">
                                <label for="clearCachesOnExit"></label>
                                <div class="field">
                                    <input class="is-checkradio is-block is-success" id="clearCachesOnExit" type="checkbox" name="clearCachesOnExit" checked="checked">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings__setting-content-item box">
                    <div class="settings__setting-content-item-title">
                        <div class="title is-5">
                            {{ translations.generalSettingsHotKey }}
                        </div>
                        <button class="button" @click="resetHotKey"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                    </div>
                    <div class="columns">
                        <div class="column field has-addons">
                            <div class="control">
                                <div class="select">
                                    <select v-model="config.generalOptions.hotKey.modifier">
                                        <option v-for="globalHotKeyModifier in globalHotKeyModifiers">{{ globalHotKeyModifier }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="control is-expanded">
                                <div class="select is-fullwidth">
                                    <select v-model="config.generalOptions.hotKey.key">
                                        <option v-for="globalHotKeyKey in globalHotKeyKeys">{{ globalHotKeyKey }}</option>
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
                    <div class="settings__setting-content-item-title">
                        <div class="title is-5">
                            {{ translations.generalSettingsRescanInterval }}
                        </div>
                        <button class="button" @click="resetRescanInterval"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                    </div>
                    <div class="columns">
                        <div class="column field has-addons">
                            <div class="control is-expanded">
                                <input class="input" type="number" min="10" v-model="config.generalOptions.rescanIntervalInSeconds">
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
                    <div class="settings__setting-content-item-title">
                        <div class="title is-5">
                            {{ translations.generalSettingsShowAlwaysOnPrimaryDisplay }}
                        </div>
                        <button class="button" @click="resetShowAlwaysOnPrimaryDisplay">
                            <span class="icon">
                                <i class="fas fa-undo-alt"></i>
                            </span>
                        </button>
                    </div>
                    <div class="columns">
                        <div class="column field has-addons">
                            <div class="control is-expanded">
                                <input class="is-checkradio" id="showAlwaysOnPrimaryDisplayCheckbox" type="checkbox" name="showAlwaysOnPrimaryDisplayCheckbox" v-model="config.generalOptions.showAlwaysOnPrimaryDisplay" @change="updateConfig">
                                <label for="showAlwaysOnPrimaryDisplayCheckbox"></label>
                                <div class="field">
                                    <input class="is-checkradio is-block is-success" id="showAlwaysOnPrimaryDisplayCheckbox" type="checkbox" name="showAlwaysOnPrimaryDisplayCheckbox" checked="checked">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `,
});
