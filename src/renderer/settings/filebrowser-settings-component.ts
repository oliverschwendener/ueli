import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { Settings } from "./settings";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { cloneDeep } from "lodash";
import { defaultFileBrowserOptions } from "../../common/config/default-filebrowser-options";

export const fileBrowserSettingsComponent = Vue.extend({
    data() {
        return {
            settingName: Settings.FileBrowser,
            visible: false,
        };
    },
    methods: {
        resetAll() {
            const config: UserConfigOptions = this.config;
            config.fileBrowserOptions = cloneDeep(defaultFileBrowserOptions);
            this.updateConfig();
        },
        toggleEnabled() {
            const config: UserConfigOptions = this.config;
            config.fileBrowserOptions.isEnabled = !config.fileBrowserOptions.isEnabled;
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
                {{ translations.fileBrowser }}
            </span>
            <div>
                <button class="button" :class="{ 'is-success' : config.fileBrowserOptions.isEnabled }" @click="toggleEnabled">
                    <span class="icon"><i class="fas fa-power-off"></i></span>
                </button>
                <button class="button" @click="resetAll">
                    <span class="icon"><i class="fas fa-undo-alt"></i></span>
                </button>
            </div>
        </div>
        <div class="settings__setting-content" v-if="config.fileBrowserOptions.isEnabled">
            <div class="box">

                <div class="settings__option">
                    <div class="settings__option-name">{{ translations.fileBrowserSettingsMaxSearchResults }}</div>
                    <div class="settings__option-content">
                        <div class="field is-grouped is-grouped-right">
                            <div class="control">
                                <input class="input" type="number" min="10" v-model="config.fileBrowserOptions.maxSearchResults" @change="updateConfig">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings__option">
                    <div class="settings__option-name">{{ translations.fileBrowserOptionsShowHiddenFiles }}</div>
                    <div class="settings__option-content">
                        <div class="field has-addons has-addons-right vertical-center">
                            <div class="control">
                                <input id="showHiddenFilesCheckbox" type="checkbox" name="showHiddenFilesCheckbox" class="switch is-rounded is-success" checked="checked" v-model="config.fileBrowserOptions.showHiddenFiles" @change="updateConfig">
                                <label for="showHiddenFilesCheckbox"></label>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <h6 v-else class="title is-6 has-text-danger">
            {{ translations.fileBrowserDisabled }}
        </h6>
    </div>
    `,
});
