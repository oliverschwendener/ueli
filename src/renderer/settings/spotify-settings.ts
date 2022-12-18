import Vue from "vue";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { defaultSpotifyOptions } from "../../common/config/spotify-options";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { PluginSettings } from "./plugin-settings";
import { TranslationSet } from "../../common/translation/translation-set";
import { UserConfirmationDialogParams, UserConfirmationDialogType } from "./modals/user-confirmation-dialog-params";
import { deepCopy } from "../../common/helpers/object-helpers";

export const spotifySettingsComponent = Vue.extend({
    data() {
        return {
            settingName: PluginSettings.Spotify,
            visible: false,
        };
    },
    methods: {
        toggleEnabled() {
            const config: UserConfigOptions = this.config;
            config.spotifyOptions.isEnabled = !config.spotifyOptions.isEnabled;
            this.updateConfig();
        },
        resetAll() {
            const translations: TranslationSet = this.translations;
            const userConfirmationDialogParams: UserConfirmationDialogParams = {
                callback: () => {
                    const config: UserConfigOptions = this.config;
                    config.spotifyOptions = deepCopy(defaultSpotifyOptions);
                    this.updateConfig();
                },
                message: translations.resetPluginSettingsToDefaultWarning,
                modalTitle: translations.resetToDefault,
                type: UserConfirmationDialogType.Default,
            };
            vueEventDispatcher.$emit(VueEventChannels.settingsConfirmation, userConfirmationDialogParams);
        },
        setDevice() {
            const config: UserConfigOptions = this.config;
            const devices = config.spotifyOptions.available_devices;
            config.spotifyOptions.default_device = devices.find((device) => {
                return device.name === this.default_device;
            })!;
            this.updateConfig();

        },
        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config);
        },
        authorize() {
            vueEventDispatcher.$emit('spotify-authorize', this.config);
        },
        getDevices() {
            vueEventDispatcher.$emit(VueEventChannels.spotifyGetDevices, this.config);
        }
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.showSetting, (settingName: string) => {
            if (settingName === this.settingName) {
                this.visible = true;
            } else {
                this.visible = false;
            }
        });

        vueEventDispatcher.$on(VueEventChannels.spotifyConfigUpdated, (config: UserConfigOptions)=>{
            this.config.spotifyOptions.available_devices = config.spotifyOptions.available_devices;
        });
    },
    props: ["config", "translations"],
    template: `
    <div v-if="visible">
            <div class="settings__setting-title title is-3">
                <span>
                    Spotify
                </span>
                <div>
                    <plugin-toggle :is-enabled="config.spotifyOptions.isEnabled" :toggled="toggleEnabled"/>
                    <button class="button" @click="resetAll">
                        <span class="icon">
                            <i class="fas fa-undo-alt"></i>
                        </span>
                    </button>
                </div>
            </div>
            <p class="settings__setting-description">This plugin enables you to quickly search and play songs from spotify.</p>
            <div class="settings__setting-content">
                <div v-if="!config.spotifyOptions.isLoggedIn" class="settings__setting-disabled-overlay"></div>
                <div class="box">
                    <div class="settings__options-container">
                        <div class="settings__option">
                            <div class="settings__option-name">Available devices</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="control">
                                        <div class="select">
                                            <select v-model="default_device" @click="getDevices" @change="setDevice">
                                                <option v-for="availableDevices in config.spotifyOptions.available_devices">{{availableDevices.name}}</option>
                                            </select>
                                        </div> 
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="settings__option">
                            <div class="settings__option-name">Prefix</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="control">
                                        <input
                                            type="text"
                                            class="input font-mono"
                                            v-model="config.spotifyOptions.prefix"
                                            @change="updateConfig"
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="settings__option">
                            <div class="settings__option-name">Client ID</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="control">
                                        <input
                                            type="text"
                                            class="input font-mono"
                                            v-model="config.spotifyOptions.client_id"
                                            @change="updateConfig"
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="settings__option">
                            <div class="settings__option-name">Client Secret</div>
                            <div class="settings__option-content">
                                <div class="field is-grouped is-grouped-right">
                                    <div class="control">
                                        <input
                                            type="text"
                                            class="input font-mono"
                                            v-model="config.spotifyOptions.client_secret"
                                            @change="updateConfig"
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="settings__option">
                        <div class="settings__option-name">Redirect URL</div>
                        <div class="settings__option-content">
                            <div class="field is-grouped is-grouped-right">
                                <div class="control">
                                    <input
                                        type="text"
                                        class="input font-mono"
                                        v-model="config.spotifyOptions.redirect_uri"
                                        @change="updateConfig"
                                    >
                                </div>
                            </div>
                        </div>
                    </div>                        
                    </div>
                </div>
                <button class="button" @click="authorize">
                    <span class="icon">
                    <img src="https://img.icons8.com/fluency/48/null/spotify.png"/>
                    </span>
                    <br><span><strong>Connect<strong/></span>
                </button>
            </div>
        </div>
    `,
});
