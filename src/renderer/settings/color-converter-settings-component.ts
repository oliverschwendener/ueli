import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { PluginSettings } from "./plugin-settings";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { defaultColorConverterOptions } from "../../common/config/color-converter-options";
import { deepCopy } from "../../common/helpers/object-helpers";

export const colorConverterSettingsComponent = Vue.extend({
    data() {
        return {
            settingName: PluginSettings.ColorConverter,
            visible: false,
        };
    },
    methods: {
        toggleEnabled() {
            const config: UserConfigOptions = this.config;
            config.colorConverterOptions.isEnabled = !config.colorConverterOptions.isEnabled;
            this.updateConfig();
        },
        resetAll() {
            const config: UserConfigOptions = this.config;
            config.colorConverterOptions = deepCopy(defaultColorConverterOptions);
            this.updateConfig();
        },
        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config);
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
                {{ translations.colorConverter }}
            </span>
            <div>
                <plugin-toggle :is-enabled="config.colorConverterOptions.isEnabled" :toggled="toggleEnabled"/>
                <button class="button" @click="resetAll">
                    <span class="icon">
                        <i class="fas fa-undo-alt"></i>
                    </span>
                </button>
            </div>
        </div>
        <p class="settings__setting-description" v-html="translations.colorConverterDescription"></p>
        <div class="settings__setting-content">
            <div v-if="!config.colorConverterOptions.isEnabled" class="settings__setting-disabled-overlay"></div>
            <div class="box">
                <div class="settings__option-container">

                    <div class="settings__option">
                        <div class="settings__option-name">{{ translations.colorConverterShowColorPreview }}</div>
                        <div class="settings__option-content">
                            <div class="field is-grouped is-grouped-right">
                                <div class="control">
                                    <input id="colorPreviewToggle" type="checkbox" name="colorPreviewToggle" class="switch is-rounded is-success" checked="checked" v-model="config.colorConverterOptions.showColorPreview" @change="updateConfig()">
                                    <label for="colorPreviewToggle"></label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="settings__option">
                        <div class="settings__option-name">HEX</div>
                        <div class="settings__option-content">
                            <div class="field is-grouped is-grouped-right">
                                <div class="control">
                                    <input id="hexToggle" type="checkbox" name="hexToggle" class="switch is-rounded is-success" checked="checked" v-model="config.colorConverterOptions.hexEnabled" @change="updateConfig()">
                                    <label for="hexToggle"></label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="settings__option">
                        <div class="settings__option-name">RGB</div>
                        <div class="settings__option-content">
                            <div class="field is-grouped is-grouped-right">
                                <div class="control">
                                    <input id="rgbToggle" type="checkbox" name="rgbToggle" class="switch is-rounded is-success" checked="checked" v-model="config.colorConverterOptions.rgbEnabled" @change="updateConfig()">
                                    <label for="rgbToggle"></label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="settings__option">
                        <div class="settings__option-name">RGBA</div>
                        <div class="settings__option-content">
                            <div class="field is-grouped is-grouped-right">
                                <div class="control">
                                    <input id="rgbaToggle" type="checkbox" name="rgbaToggle" class="switch is-rounded is-success" checked="checked" v-model="config.colorConverterOptions.rgbaEnabled" @change="updateConfig()">
                                    <label for="rgbaToggle"></label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="settings__option">
                        <div class="settings__option-name">HSL</div>
                        <div class="settings__option-content">
                            <div class="field is-grouped is-grouped-right">
                                <div class="control">
                                    <input id="hslToggle" type="checkbox" name="hslToggle" class="switch is-rounded is-success" checked="checked" v-model="config.colorConverterOptions.hslEnabled" @change="updateConfig()">
                                    <label for="hslToggle"></label>
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
