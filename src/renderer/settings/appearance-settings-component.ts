import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { cloneDeep } from "lodash";
import { defaultAppearanceOptions } from "../../common/config/default-appearance-options";
import { Settings } from "./settings";

export const appearanceSettingsComponent = Vue.extend({
    data() {
        return {
            settingName: Settings.Appearance,
            visible: false,
        };
    },
    methods: {
        resetAll() {
            const config: UserConfigOptions = this.config;
            config.appearanceOptions = cloneDeep(defaultAppearanceOptions);
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
                {{ translations.appearanceSettings }}
            </span>
            <button class="button" @click="resetAll">
                <span class="icon"><i class="fas fa-undo-alt"></i></span>
            </button>
        </div>
        <div class="settings__setting-content">
            <div class=" box">
                <div class="settings__options-container">

                    <div class="settings__option">
                        <div class="settings__option-name">{{ translations.appearanceSettingsWindowWidth }}</div>
                        <div class="settings__option-content">
                            <div class="field is-grouped is-grouped-right">
                                <div class="control">
                                    <input type="number" class="input" v-model="config.appearanceOptions.windowWidth" @change="updateConfig">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="settings__option">
                        <div class="settings__option-name">{{ translations.appearanceSettingsMaxSearchResultsPerPage }}</div>
                        <div class="settings__option-content">
                            <div class="field is-grouped is-grouped-right">
                                <div class="control">
                                    <input type="number" class="input" v-model="config.appearanceOptions.maxSearchResultsPerPage" @change="updateConfig">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="settings__option">
                        <div class="settings__option-name">{{ translations.appearanceSettingsSearchResultHeight }}</div>
                        <div class="settings__option-content">
                            <div class="field is-grouped is-grouped-right">
                                <div class="control">
                                    <input type="number" class="input" v-model="config.appearanceOptions.searchResultHeight" @change="updateConfig">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="settings__option">
                        <div class="settings__option-name">{{ translations.appearanceSettingsSmoothScrolling }}</div>
                        <div class="settings__option-content">
                            <div class="field has-addons has-addons-right vertical-center">
                                <div class="control">
                                    <input id="smoothScrollingCheckBox" type="checkbox" name="smoothScrollingCheckBox" class="switch is-rounded is-success" checked="checked" v-model="config.appearanceOptions.smoothScrolling" @change="updateConfig">
                                    <label for="smoothScrollingCheckBox"></label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="settings__option">
                        <div class="settings__option-name">{{ translations.appearanceSettingsUserInputHeight }}</div>
                        <div class="settings__option-content">
                            <div class="field is-grouped is-grouped-right">
                                <div class="control">
                                    <input type="number" class="input" v-model="config.appearanceOptions.userInputHeight" @change="updateConfig">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="settings__option">
                        <div class="settings__option-name">{{ translations.appearanceSettingsShowDescriptionOnAllSearchResults }}</div>
                        <div class="settings__option-content">
                            <div class="field has-addons has-addons-right vertical-center">
                                <div class="control">
                                    <input id="showDescriptionOnAllSearchResults" type="checkbox" name="showDescriptionOnAllSearchResults" class="switch is-rounded is-success" checked="checked" v-model="config.appearanceOptions.showDescriptionOnAllSearchResults" @change="updateConfig">
                                    <label for="showDescriptionOnAllSearchResults"></label>
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
