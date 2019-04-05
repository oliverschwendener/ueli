import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { Settings } from "./settings";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { defaultOperatingSystemCommandsOptions } from "../../common/config/default-operating-system-commands-options";
import { cloneDeep } from "lodash";

export const operatingSystemSettingsComponent = Vue.extend({
    data() {
        return {
            settingName: Settings.OperatingSystemCommands,
            visible: false,
        };
    },
    methods: {
        toggleEnabled() {
            const config: UserConfigOptions = this.config;
            config.operatingSystemCommandsOptions.isEnabled = !config.operatingSystemCommandsOptions.isEnabled;
            this.updateConfig();
        },
        resetAll() {
            const config: UserConfigOptions = this.config;
            config.operatingSystemCommandsOptions = cloneDeep(defaultOperatingSystemCommandsOptions);
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
                {{ translations.operatingSystemCommands }}
            </span>
            <div>
                <button class="button" :class="{ 'is-success' : config.operatingSystemCommandsOptions.isEnabled }" @click="toggleEnabled">
                    <span class="icon"><i class="fas fa-power-off"></i></span>
                </button>
                <button class="button" @click="resetAll">
                    <span class="icon">
                        <i class="fas fa-undo-alt"></i>
                    </span>
                </button>
            </div>
        </div>
    </div>
    `,
});
