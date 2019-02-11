import Vue from "vue";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";
import { SettingOsSpecific } from "./settings-os-specific";
import { platform } from "os";
import { UserConfigOptions } from "../common/config/user-config-options";
import { defaultMdfindOptions } from "../common/config/default-mdfind-options";
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
        resetMdfindPrefix() {
            const config: UserConfigOptions = this.config;
            config.mdfindOptions.prefix = defaultMdfindOptions.prefix;
            this.updateConfig();
        },
        resetMdfindMaxResults() {
            const config: UserConfigOptions = this.config;
            config.mdfindOptions.maxSearchResults = defaultMdfindOptions.maxSearchResults;
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
    props: ["config"],
    template: `
        <div v-if="visible">
            <div class="settings__setting-title title is-3">
                <span>
                    mdfind
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
                <div class="settings__setting-content-item box">
                    <div class="settings__setting-content-item-title">
                        <div class="title is-5">Prefix</div>
                        <button class="button" @click="resetMdfindPrefix"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                    </div>
                    <div class="columns">
                        <div class="column field has-addons">
                            <div class="control is-expanded">
                                <input type="text" class="input" v-model="config.mdfindOptions.prefix">
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
                        <div class="title is-5">Prefix</div>
                        <button class="button" @click="resetMdfindMaxResults"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                    </div>
                    <div class="columns">
                        <div class="column field has-addons">
                            <div class="control is-expanded">
                                <input type="number" min="1" max="100" class="input" v-model="config.mdfindOptions.maxSearchResults">
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
            <h6 v-else class="title is-6 has-text-danger">mdfind is disabled</h6>
        </div>
    `,
});
