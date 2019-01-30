import Vue from "vue";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";
import { UserConfigOptions } from "../common/config/user-config-options";
import { cloneDeep } from "lodash";
import { defaultGeneralOptions } from "../common/config/default-general-options";
import { Settings } from "./settings";

export const generalSettingsComponent = Vue.extend({
    data() {
        return {
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
        resetAutostart() {
            const config: UserConfigOptions = this.config;
            config.generalOptions.autostart = defaultGeneralOptions.autostart;
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
        <div v-if="visible">
            <div class="settings__setting-title title is-3">
                <span>General Options</span>
                <button class="button" @click="resetAll">
                    <span class="icon"><i class="fas fa-undo-alt"></i></span>
                </button>
            </div>
            <div class="settings__setting-content">
                <div class="settings__setting-content-item box">
                    <div class="settings__setting-content-item-title">
                        <div class="title is-5">Autostart App</div>
                        <button class="button" @click="resetAutostart"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                    </div>
                    <div class="columns">
                        <div class="column field has-addons">
                            <div class="control is-expanded">
                                <input class="is-checkradio" id="autoStartCheckbox" type="checkbox" name="autoStartCheckbox" v-model="config.generalOptions.autostart" @change="updateConfig">
                                <label for="autoStartCheckbox"></label>
                                <div class="field">
                                    <input class="is-checkradio is-block is-success" id="exampleCheckboxBlockSuccess" type="checkbox" name="exampleCheckboxBlockSuccess" checked="checked">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="settings__setting-content-item box">
                    <div class="settings__setting-content-item-title">
                        <div class="title is-5">Clear caches on exit</div>
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
                        <div class="title is-5">Hot Key</div>
                        <button class="button" @click="resetHotKey"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                    </div>
                    <div class="columns">
                        <div class="column field has-addons">
                            <div class="control is-expanded">
                                <input class="input" type="text" v-model="config.generalOptions.hotKey">
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
                        <div class="title is-5">Rescan interval (in seconds)</div>
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
            </div>
        </div>
    `,
});
