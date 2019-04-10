import Vue from "vue";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { defaultEmailOptions } from "../../common/config/default-email-options";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { cloneDeep } from "lodash";
import { PluginSettings } from "./plugin-settings";

export const emailSettingsComponent = Vue.extend({
    data() {
        return {
            settingName: PluginSettings.Email,
            visible: false,
        };
    },
    methods: {
        toggleEnabled() {
            const config: UserConfigOptions = this.config;
            config.emailOptions.isEnabled = !config.emailOptions.isEnabled;
            this.updateConfig();
        },
        resetAll() {
            const config: UserConfigOptions = this.config;
            config.emailOptions = cloneDeep(defaultEmailOptions);
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
                {{ translations.email }}
            </span>
            <div>
                <button class="button" :class="{ 'is-success' : config.emailOptions.isEnabled }" @click="toggleEnabled">
                    <span class="icon"><i class="fas fa-power-off"></i></span>
                </button>
                <button v-if="config.emailOptions.isEnabled" class="button" @click="resetAll">
                    <span class="icon"><i class="fas fa-undo-alt"></i></span>
                </button>
            </div>
        </div>
        <p class="settings__setting-description" v-html="translations.emailSettingsDescription"></p>
    </div>
    `,
});
