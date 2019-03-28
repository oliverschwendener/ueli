import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { SettingOsSpecific } from "./settings-os-specific";
import { platform } from "os";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { defaultMdfindOptions } from "../../common/config/default-mdfind-options";
import { cloneDeep } from "lodash";

export const mdfindSettingsComponent = Vue.extend({
    data() {
        return {
            settingName: SettingOsSpecific.MdFind.replace(`${platform()}:`, ""),
            visible: false,
        };
    },
    methods: {
        resetAll() {
            const config: UserConfigOptions = this.config;
            config.mdfindOptions = cloneDeep(defaultMdfindOptions);
            this.updateConfig();
        },
        toggleEnabled() {
            const config: UserConfigOptions = this.config;
            config.mdfindOptions.enabled = !config.mdfindOptions.enabled;
            this.updateConfig();
        },
        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config);
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.showSetting, (setting: string) => {
            if (setting === this.settingName) {
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
                    {{ translations.mdfindSearch }}
                </span>
                <div>
                    <button class="button" :class="{ 'is-success' : config.mdfindOptions.enabled }" @click="toggleEnabled">
                        <span class="icon"><i class="fas fa-power-off"></i></span>
                    </button>
                    <button v-if="config.mdfindOptions.enabled" class="button" @click="resetAll">
                        <span class="icon"><i class="fas fa-undo-alt"></i></span>
                    </button>
                </div>
            </div>
            <div class="settings__setting-content" v-if="config.mdfindOptions.enabled">
                <div class="box">
                    <div class="settings__option-container">

                    <div class="settings__option">
                        <div class="settings__option-name">{{ translations.mdfindSearchDebounceDelay }}</div>
                        <div class="settings__option-content">
                            <div class="field is-grouped is-grouped-right">
                                <div class="control">
                                    <input
                                        type="number"
                                        min="1"
                                        class="input"
                                        v-model="config.mdfindOptions.debounceDelay"
                                        @change="updateConfig"
                                        >
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="settings__option">
                        <div class="settings__option-name">{{ translations.mdfindSearchPrefix }}</div>
                        <div class="settings__option-content">
                            <div class="field is-grouped is-grouped-right">
                                <div class="control">
                                    <input
                                        type="text"
                                        class="input font-mono"
                                        v-model="config.mdfindOptions.prefix"
                                        @change="updateConfig"
                                    >
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="settings__option">
                        <div class="settings__option-name">{{ translations.mdfindSearchMaxSearchResults }}</div>
                        <div class="settings__option-content">
                            <div class="field is-grouped is-grouped-right">
                                <div class="control">
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        class="input" 
                                        v-model="config.mdfindOptions.maxSearchResults"
                                        @change="updateConfig"
                                        >
                                </div>
                            </div>
                        </div>
                    </div>

                    </div>
                </div>
            </div>
            <h6 v-else class="title is-6 has-text-danger">
                {{ translations.mdfindSearchDisabled }}
            </h6>
        </div>
    `,
});
