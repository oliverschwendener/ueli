import Vue from "vue";
import { SettingOsSpecific } from "./settings-os-specific";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { defaultUwpSearchOptions } from "../../common/config/uwp-search-options";
import { platform } from "os";
import { deepCopy } from "../../common/helpers/object-helpers";
import { PluginType } from "../../main/plugin-type";

export const uwpSettingsComponent = Vue.extend({
    data() {
        return {
            settingName: SettingOsSpecific.Uwp.replace(`${platform()}:`, ""),
            visible: false,
        };
    },
    methods: {
        toggleEnabled() {
            const config: UserConfigOptions = this.config;
            config.uwpSearchOptions.isEnabled = !config.uwpSearchOptions.isEnabled;
            this.updateConfig();
        },
        resetAll() {
            const config: UserConfigOptions = this.config;
            config.uwpSearchOptions = deepCopy(defaultUwpSearchOptions);
            this.updateConfig();
        },
        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config, true, PluginType.Uwp);
        },
    },
    props: ["config", "translations"],
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.showSetting, (settingName: string) => {
            if (this.settingName === settingName) {
                this.visible = true;
            } else {
                this.visible = false;
            }
        });
    },
    template: `
        <div v-if="visible">
            <div class="settings__setting-title title is-3">
                <span>
                    UWP
                </span>
                <div>
                    <plugin-toggle :is-enabled="config.uwpSearchOptions.isEnabled" :toggled="toggleEnabled"/>
                    <button class="button" @click="resetAll">
                        <span class="icon">
                            <i class="fas fa-undo-alt"></i>
                        </span>
                    </button>
                </div>
            </div>
            <p class="settings__setting-description" v-html="translations.uwpSettingsDescription"></p>
        </div>
    `,
});
