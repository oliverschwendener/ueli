import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { defaultColorThemeOptions } from "../../common/config/default-color-theme-options";
import { cloneDeep } from "lodash";
import { GeneralSettings } from "./general-settings";

export const colorThemeSettingsComponent = Vue.extend({
    data() {
        return {
            settingName: GeneralSettings.ColorTheme,
            visible: false,
        };
    },
    methods: {
        resetAll() {
            const config: UserConfigOptions = this.config;
            config.colorThemeOptions = cloneDeep(defaultColorThemeOptions);
            this.updateConfig();
        },
        resetUserInputBackgroundColor() {
            const config: UserConfigOptions = this.config;
            config.colorThemeOptions.userInputBackgroundColor = defaultColorThemeOptions.userInputBackgroundColor;
            this.updateConfig();
        },
        resetUserInputTextColor() {
            const config: UserConfigOptions = this.config;
            config.colorThemeOptions.userInputTextColor = defaultColorThemeOptions.userInputTextColor;
            this.updateConfig();
        },
        resetSearchResultsBackgroundColor() {
            const config: UserConfigOptions = this.config;
            config.colorThemeOptions.searchResultsBackgroundColor = defaultColorThemeOptions.searchResultsBackgroundColor;
            this.updateConfig();
        },
        resetSearchResultsItemActiveBackgroundColor() {
            const config: UserConfigOptions = this.config;
            config.colorThemeOptions.searchResultsItemActiveBackgroundColor = defaultColorThemeOptions.searchResultsItemActiveBackgroundColor;
            this.updateConfig();
        },
        resetSearchResultsItemActiveTextColor() {
            const config: UserConfigOptions = this.config;
            config.colorThemeOptions.searchResultsItemActiveTextColor = defaultColorThemeOptions.searchResultsItemActiveTextColor;
            this.updateConfig();
        },
        resetSearchResultsItemNameTextColor() {
            const config: UserConfigOptions = this.config;
            config.colorThemeOptions.searchResultsItemNameTextcolor = defaultColorThemeOptions.searchResultsItemNameTextcolor;
            this.updateConfig();
        },
        resetSearchResultsItemDescriptionTextColor() {
            const config: UserConfigOptions = this.config;
            config.colorThemeOptions.searchResultsItemDescriptionTextColor = defaultColorThemeOptions.searchResultsItemDescriptionTextColor;
            this.updateConfig();
        },
        resetScrollbarForegroundColor() {
            const config: UserConfigOptions = this.config;
            config.colorThemeOptions.scrollbarForegroundColor = defaultColorThemeOptions.scrollbarForegroundColor;
            this.updateConfig();
        },
        resetScrollbarBackgroundColor() {
            const config: UserConfigOptions = this.config;
            config.colorThemeOptions.scrollbarBackgroundColor = defaultColorThemeOptions.scrollbarBackgroundColor;
            this.updateConfig();
        },
        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config);
        },
        getPreviewColor(color: string): string {
            return `background-color: ${color};`;
        },
        editColor(pickerId: string, color: string) {
            vueEventDispatcher.$emit(VueEventChannels.editColor, pickerId, color);
        },
        updateColor(pickerId: string, color: string) {
            Object.keys(this.config.colorThemeOptions).forEach((key) => {
                if (key === pickerId) {
                    this.config.colorThemeOptions[key] = color;
                }
            });
            this.updateConfig();
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

        vueEventDispatcher.$on(VueEventChannels.saveColor, (pickerId: string, color: string) => {
            this.updateColor(pickerId, color);
        });
    },
    props: ["config", "translations"],
    template: `
    <div v-if="visible">
        <div class="settings__setting-title title is-3">
            <span>
                {{ translations.colorThemeSettings }}
            </span>
            <button class="button" @click="resetAll">
                <span class="icon"><i class="fas fa-undo-alt"></i></span>
            </button>
        </div>
        <div class="box">

            <div class="settings__options-container">

                <div class="settings__option">
                    <div class="settings__option-name">{{ translations.colorthemeUserInputBackgroundColor }}</div>
                    <div class="settings__option-content">
                        <div class="field has-addons has-addons-right">
                            <div class="control">
                                <button
                                    class="button preview-button"
                                    :style="getPreviewColor(config.colorThemeOptions.userInputBackgroundColor)"
                                    @click="editColor('userInputBackgroundColor', config.colorThemeOptions.userInputBackgroundColor)"
                                    >
                                </button>
                            </div>
                            <div class="control">
                                <input
                                    class="input font-mono"
                                    type="text"
                                    v-model="config.colorThemeOptions.userInputBackgroundColor"
                                    @change="updateConfig"
                                    >
                            </div>
                            <div class="control">
                                <button class="button" @click="resetUserInputBackgroundColor">
                                    <span class="icon">
                                        <i class="fas fa-undo-alt"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings__option">
                    <div class="settings__option-name">{{ translations.colorThemeUserInputTextColor }}</div>
                    <div class="settings__option-content">
                        <div class="field has-addons has-addons-right">
                            <div class="control">
                                <button
                                    class="button preview-button"
                                    :style="getPreviewColor(config.colorThemeOptions.userInputTextColor)"
                                    @click="editColor('userInputTextColor', config.colorThemeOptions.userInputTextColor)"
                                    >
                                </button>
                            </div>
                            <div class="control">
                                <input
                                    class="input font-mono"
                                    type="text"
                                    v-model="config.colorThemeOptions.userInputTextColor"
                                    @change="updateConfig"
                                    >
                            </div>
                            <div class="control">
                                <button class="button" @click="resetUserInputTextColor">
                                    <span class="icon">
                                        <i class="fas fa-undo-alt"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings__option">
                    <div class="settings__option-name">{{ translations.colorThemeSearchResultsBackgroundColor }}</div>
                    <div class="settings__option-content">
                        <div class="field has-addons has-addons-right">
                            <div class="control">
                                <button
                                    class="button preview-button"
                                    :style="getPreviewColor(config.colorThemeOptions.searchResultsBackgroundColor)"
                                    @click="editColor('searchResultsBackgroundColor', config.colorThemeOptions.searchResultsBackgroundColor)"
                                    >
                                </button>
                            </div>
                            <div class="control">
                                <input
                                    class="input font-mono"
                                    type="text"
                                    v-model="config.colorThemeOptions.searchResultsBackgroundColor"
                                    @change="updateConfig"
                                    >
                            </div>
                            <div class="control">
                                <button class="button" @click="resetSearchResultsBackgroundColor">
                                    <span class="icon">
                                        <i class="fas fa-undo-alt"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings__option">
                    <div class="settings__option-name">{{ translations.colorThemeSearchResultsItemActiveBackgroundColor }}</div>
                    <div class="settings__option-content">
                        <div class="field has-addons has-addons-right">
                            <div class="control">
                                <button
                                    class="button preview-button"
                                    :style="getPreviewColor(config.colorThemeOptions.searchResultsItemActiveBackgroundColor)"
                                    @click="editColor('searchResultsItemActiveBackgroundColor', config.colorThemeOptions.searchResultsItemActiveBackgroundColor)"
                                    >
                                </button>
                            </div>
                            <div class="control">
                                <input
                                    class="input font-mono"
                                    type="text"
                                    v-model="config.colorThemeOptions.searchResultsItemActiveBackgroundColor"
                                    @change="updateConfig"
                                    >
                            </div>
                            <div class="control">
                                <button class="button" @click="resetSearchResultsItemActiveBackgroundColor">
                                    <span class="icon">
                                        <i class="fas fa-undo-alt"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings__option">
                    <div class="settings__option-name">{{ translations.colorThemeSearchResultsItemActiveTextColor }}</div>
                    <div class="settings__option-content">
                        <div class="field has-addons has-addons-right">
                            <div class="control">
                                <button
                                    class="button preview-button"
                                    :style="getPreviewColor(config.colorThemeOptions.searchResultsItemActiveTextColor)"
                                    @click="editColor('searchResultsItemActiveTextColor', config.colorThemeOptions.searchResultsItemActiveTextColor)"
                                    >
                                </button>
                            </div>
                            <div class="control">
                                <input
                                    class="input font-mono"
                                    type="text"
                                    v-model="config.colorThemeOptions.searchResultsItemActiveTextColor"
                                    @change="updateConfig"
                                    >
                            </div>
                            <div class="control">
                                <button class="button" @click="resetSearchResultsItemActiveTextColor">
                                    <span class="icon">
                                        <i class="fas fa-undo-alt"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings__option">
                    <div class="settings__option-name">{{ translations.colorThemeSearchResutlsItemNameTextColor }}</div>
                    <div class="settings__option-content">
                        <div class="field has-addons has-addons-right">
                            <div class="control">
                                <button
                                    class="button preview-button"
                                    :style="getPreviewColor(config.colorThemeOptions.searchResultsItemNameTextcolor)"
                                    @click="editColor('searchResultsItemNameTextcolor', config.colorThemeOptions.searchResultsItemNameTextcolor)"
                                    >
                                </button>
                            </div>
                            <div class="control">
                                <input
                                    class="input font-mono"
                                    type="text"
                                    v-model="config.colorThemeOptions.searchResultsItemNameTextcolor"
                                    @change="updateConfig"
                                    >
                            </div>
                            <div class="control">
                                <button class="button" @click="resetSearchResultsItemNameTextColor">
                                    <span class="icon">
                                        <i class="fas fa-undo-alt"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings__option">
                    <div class="settings__option-name">{{ translations.colorThemeSearchResultsItemDescriptionTextColor }}</div>
                    <div class="settings__option-content">
                        <div class="field has-addons has-addons-right">
                            <div class="control">
                                <button
                                    class="button preview-button"
                                    :style="getPreviewColor(config.colorThemeOptions.searchResultsItemDescriptionTextColor)"
                                    @click="editColor('searchResultsItemDescriptionTextColor', config.colorThemeOptions.searchResultsItemDescriptionTextColor)"
                                    >
                                </button>
                            </div>
                            <div class="control">
                                <input
                                    class="input font-mono"
                                    type="text"
                                    v-model="config.colorThemeOptions.searchResultsItemDescriptionTextColor"
                                    @change="updateConfig"
                                    >
                            </div>
                            <div class="control">
                                <button class="button" @click="resetSearchResultsItemDescriptionTextColor">
                                    <span class="icon">
                                        <i class="fas fa-undo-alt"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings__option">
                    <div class="settings__option-name">{{ translations.colorThemeScrollbarForegroundColor }}</div>
                    <div class="settings__option-content">
                        <div class="field has-addons has-addons-right">
                            <div class="control">
                                <button
                                    class="button preview-button"
                                    :style="getPreviewColor(config.colorThemeOptions.scrollbarForegroundColor)"
                                    @click="editColor('scrollbarForegroundColor', config.colorThemeOptions.scrollbarForegroundColor)"
                                    >
                                </button>
                            </div>
                            <div class="control">
                                <input
                                    class="input font-mono"
                                    type="text"
                                    v-model="config.colorThemeOptions.scrollbarForegroundColor"
                                    @change="updateConfig"
                                    >
                            </div>
                            <div class="control">
                                <button class="button" @click="resetScrollbarForegroundColor">
                                    <span class="icon">
                                        <i class="fas fa-undo-alt"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings__option">
                    <div class="settings__option-name">{{ translations.colorThemeScrollbarBackgroundColor }}</div>
                    <div class="settings__option-content">
                        <div class="field has-addons has-addons-right">
                            <div class="control">
                                <button
                                    class="button preview-button"
                                    :style="getPreviewColor(config.colorThemeOptions.scrollbarBackgroundColor)"
                                    @click="editColor('scrollbarBackgroundColor', config.colorThemeOptions.scrollbarBackgroundColor)"
                                    >
                                </button>
                            </div>
                            <div class="control">
                                <input
                                    class="input font-mono"
                                    type="text"
                                    v-model="config.colorThemeOptions.scrollbarBackgroundColor"
                                    @change="updateConfig"
                                    >
                            </div>
                            <div class="control">
                                <button class="button" @click="resetScrollbarBackgroundColor">
                                    <span class="icon">
                                        <i class="fas fa-undo-alt"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <color-picker :translations="translations"></color-picker>

        </div>
    </div>
    `,
});
