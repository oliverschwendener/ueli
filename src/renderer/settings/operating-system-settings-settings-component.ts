import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { PluginSettings } from "./plugin-settings";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { defaultOperatingSystemSettingsOptions } from "../../common/config/default-operating-system-settings-options";
import { cloneDeep } from "lodash";

export const operatingSystemSettingsSettingsComponent = Vue.extend({
    data() {
        return {
            settingName: PluginSettings.OperatingSystemSettings,
            visible: false,
        };
    },
    methods: {
        toggleEnabled() {
            const config: UserConfigOptions = this.config;
            config.operatingSystemSettingsOptions.isEnabled = !config.operatingSystemSettingsOptions.isEnabled;
            this.updateConfig();
        },
        resetAll() {
            const config: UserConfigOptions = this.config;
            config.operatingSystemSettingsOptions = cloneDeep(defaultOperatingSystemSettingsOptions);
            this.updateConfig();
        },
        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config);
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.showSetting, (settingName: string) => {
            if (this.settingName === settingName) {
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
                {{ translations.operatingSystemSettings }}
            </span>
            <div>
                <button class="button" :class="{ 'is-success' : config.operatingSystemSettingsOptions.isEnabled }" @click="toggleEnabled">
                    <span class="icon"><i class="fas fa-power-off"></i></span>
                </button>
                <button class="button" @click="resetAll">
                    <span class="icon">
                        <i class="fas fa-undo-alt"></i>
                    </span>
                </button>
            </div>
        </div>
        <p class="settings__setting-description" v-html="translations.operatingSystemSettingsSettingsDescription"></p>
    </div>
    `,
});
