import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { PluginSettings } from "./plugin-settings";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { defaultBrowserBookmarksOptions } from "../../common/config/browser-bookmarks-options";
import { Browser } from "../../main/plugins/browser-bookmarks-plugin/browser";
import { deepCopy } from "../../common/helpers/object-helpers";
import { PluginType } from "../../main/plugin-type";

export const browserBookmarkSettingsComponent = Vue.extend({
    data() {
        return {
            availableBrowsers: Object.values(Browser),
            isVisible: false,
            settingName: PluginSettings.BrowserBookmarks,
        };
    },

    methods: {
        toggleEnabled() {
            const config: UserConfigOptions = this.config;
            config.browserBookmarksOptions.isEnabled = !config.browserBookmarksOptions.isEnabled;
            this.updateConfig();
        },

        resetAll() {
            const config: UserConfigOptions = this.config;
            config.browserBookmarksOptions = deepCopy(defaultBrowserBookmarksOptions);
            this.updateConfig();
        },

        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config, true, PluginType.BrowserBookmarks);
        },
    },

    props: ["config", "translations"],

    mounted() {
        vueEventDispatcher.$on(VueEventChannels.showSetting, (settingName: string) => {
            this.isVisible = settingName === this.settingName;
        });
    },

    template: `
        <div v-if="isVisible">
            <div class="settings__setting-title title is-3">
                <span>
                    {{ translations.browserBookmarks }}
                </span>
                <div>
                    <plugin-toggle :is-enabled="config.browserBookmarksOptions.isEnabled" :toggled="toggleEnabled"/>
                    <button class="button" @click="resetAll">
                        <span class="icon">
                            <i class="fas fa-undo-alt"></i>
                        </span>
                    </button>
                </div>
            </div>
            <p class="settings__setting-description" v-html="translations.browserBookmarksDescription"></p>
            <div class="settings__setting-content">
                <div v-if="!config.browserBookmarksOptions.isEnabled" class="settings__setting-disabled-overlay"></div>
                <div class="box">

                    <div class="settings__option">
                        <div class="settings__option-name">{{ translations.browserBookmarksBrowser }}</div>
                        <div class="settings__option-content">
                            <div class="field is-grouped is-grouped-right">
                                <div class="control">
                                    <div class="select">
                                        <select v-model="config.browserBookmarksOptions.browser" @change="updateConfig">
                                            <option v-for="browser in availableBrowsers" :value="browser">
                                                {{ browser }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `,
});
