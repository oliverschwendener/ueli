import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { defaultColorThemeOptions } from "../../common/config/color-theme-options";
import { GeneralSettings } from "./general-settings";
import { getFolderPath, getFilePath } from "../dialogs";
import { join } from "path";
import { FileHelpers } from "../../common/helpers/file-helpers";
import { TranslationSet } from "../../common/translation/translation-set";
import { NotificationType } from "../../common/notification-type";
import { ColorThemeOptions } from "../../common/config/color-theme-options";
import { isValidColorTheme } from "../../common/helpers/color-theme-helpers";
import { showNotification } from "../notifications";
import { colorThemes } from "../color-themes/color-themes";
import { UserConfirmationDialogParams, UserConfirmationDialogType } from "./modals/user-confirmation-dialog-params";
import { deepCopy } from "../../common/helpers/object-helpers";

export const colorThemeSettingsComponent = Vue.extend({
    data() {
        return {
            colorThemes,
            dropdownVisible: false,
            presetDropdownVisible: false,
            settingName: GeneralSettings.ColorTheme,
            visible: false,
        };
    },
    methods: {
        resetAll() {
            const translations: TranslationSet = this.translations;
            const userConfirmationDialogParams: UserConfirmationDialogParams = {
                callback: () => {
                    const config: UserConfigOptions = this.config;
                    config.colorThemeOptions = deepCopy(defaultColorThemeOptions);
                    this.updateConfig();
                },
                message: translations.colorThemeSettingsResetWarning,
                modalTitle: translations.resetToDefault,
                type: UserConfirmationDialogType.Default,
            };
            vueEventDispatcher.$emit(VueEventChannels.settingsConfirmation, userConfirmationDialogParams);
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
            config.colorThemeOptions.searchResultsBackgroundColor =
                defaultColorThemeOptions.searchResultsBackgroundColor;
            this.updateConfig();
        },
        resetSearchResultsItemActiveBackgroundColor() {
            const config: UserConfigOptions = this.config;
            config.colorThemeOptions.searchResultsItemActiveBackgroundColor =
                defaultColorThemeOptions.searchResultsItemActiveBackgroundColor;
            this.updateConfig();
        },
        resetSearchResultsItemActiveTextColor() {
            const config: UserConfigOptions = this.config;
            config.colorThemeOptions.searchResultsItemActiveTextColor =
                defaultColorThemeOptions.searchResultsItemActiveTextColor;
            this.updateConfig();
        },
        resetSearchResultsItemActiveDescriptionColor() {
            const config: UserConfigOptions = this.config;
            config.colorThemeOptions.searchResultsItemActiveDescriptionColor =
                defaultColorThemeOptions.searchResultsItemActiveDescriptionColor;
            this.updateConfig();
        },
        resetSearchResultsItemNameTextColor() {
            const config: UserConfigOptions = this.config;
            config.colorThemeOptions.searchResultsItemNameTextcolor =
                defaultColorThemeOptions.searchResultsItemNameTextcolor;
            this.updateConfig();
        },
        resetSearchResultsItemDescriptionTextColor() {
            const config: UserConfigOptions = this.config;
            config.colorThemeOptions.searchResultsItemDescriptionTextColor =
                defaultColorThemeOptions.searchResultsItemDescriptionTextColor;
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
        changeColorTheme(name: string) {
            const colorTheme = colorThemes.find((c) => c.name === name);
            if (colorTheme) {
                const config: UserConfigOptions = this.config;
                config.colorThemeOptions = deepCopy(colorTheme);
                this.updateConfig();
            } else {
                showNotification("No color theme preset found", NotificationType.Error);
            }
        },
        updateColor(pickerId: string, color: string) {
            Object.keys(this.config.colorThemeOptions).forEach((key) => {
                if (key === pickerId) {
                    this.config.colorThemeOptions[key] = color;
                }
            });
            this.updateConfig();
        },
        toggleDropDown() {
            this.presetDropdownVisible = false;
            this.dropdownVisible = !this.dropdownVisible;
        },
        togglePresetDropDown() {
            this.dropdownVisible = false;
            this.presetDropdownVisible = !this.presetDropdownVisible;
        },
        importColorTheme() {
            getFilePath([{ extensions: ["json"], name: "JSON" }])
                .then((filePath: string) => {
                    const translations: TranslationSet = this.translations;
                    if (filePath) {
                        FileHelpers.readFile(filePath)
                            .then((fileContent: string) => {
                                const colorThemeOptions = JSON.parse(fileContent) as ColorThemeOptions;
                                if (isValidColorTheme(colorThemeOptions)) {
                                    const config: UserConfigOptions = this.config;
                                    config.colorThemeOptions = Object.assign(
                                        {},
                                        config.colorThemeOptions,
                                        colorThemeOptions,
                                    );
                                    this.updateConfig();
                                    vueEventDispatcher.$emit(
                                        VueEventChannels.notification,
                                        translations.colorThemeImportSucceeded,
                                        NotificationType.Info,
                                    );
                                } else {
                                    vueEventDispatcher.$emit(
                                        VueEventChannels.notification,
                                        translations.colorThemeInvalidColorTheme,
                                        NotificationType.Error,
                                    );
                                }
                            })
                            .catch((err) =>
                                vueEventDispatcher.$emit(
                                    VueEventChannels.notification,
                                    translations.colorThemeImportFailed,
                                    NotificationType.Error,
                                ),
                            );
                    }
                })
                .catch((err) => {
                    // do nothing if no file selected
                });
        },
        exportColorTheme() {
            getFolderPath()
                .then((folderPath: string) => {
                    if (folderPath) {
                        const translations: TranslationSet = this.translations;
                        const config: UserConfigOptions = this.config;
                        const fileContent = JSON.stringify(config.colorThemeOptions);
                        const filePath = join(folderPath, "ueli-color-theme.json");
                        FileHelpers.writeFile(filePath, fileContent)
                            .then(() =>
                                vueEventDispatcher.$emit(
                                    VueEventChannels.notification,
                                    translations.colorThemeExportSucceeded,
                                    NotificationType.Info,
                                ),
                            )
                            .catch(() =>
                                vueEventDispatcher.$emit(
                                    VueEventChannels.notification,
                                    translations.colorThemeExportFailed,
                                    NotificationType.Error,
                                ),
                            );
                    }
                })
                .catch((err) => {
                    // do nothing when no folder selected
                });
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
            <div>
                <button class="button" @click="resetAll">
                    <span class="icon"><i class="fas fa-undo-alt"></i></span>
                </button>
                <div class="dropdown is-right" :class="{ 'is-active' : dropdownVisible}">
                    <div class="dropdown-trigger">
                        <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" @click="toggleDropDown">
                            <span class="icon">
                                <i class="fas fa-ellipsis-v"></i>
                            </span>
                        </button>
                    </div>
                    <div class="dropdown-menu" id="dropdown-menu" role="menu">
                        <div class="dropdown-content">
                            <a href="#" class="dropdown-item" @click="importColorTheme">
                                <span class="icon"><i class="fa fa-file-import"></i></span>
                                <span>{{ translations.colorThemeSettingsImportColorTheme }}</span>
                            </a>
                            <a href="#" class="dropdown-item" @click="exportColorTheme">
                                <span class="icon"><i class="fa fa-file-export"></i></span>
                                <span>{{ translations.colorThemeSettingsExportColorTheme }}</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="dropdown is-right" :class="{ 'is-active' : presetDropdownVisible}">
                    <div class="dropdown-trigger">
                        <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" @click="togglePresetDropDown">
                            <span class="icon">
                                <i class="fas fa-swatchbook"></i>
                            </span>
                        </button>
                    </div>
                    <div class="dropdown-menu" id="dropdown-menu" role="menu">
                        <div class="dropdown-content">
                            <a v-for="colorTheme in colorThemes" href="#" class="dropdown-item" @click="changeColorTheme(colorTheme.name)">
                                {{ colorTheme.name }}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="box">
            <div class="settings__options-container">

                <div class="settings__setting-content-item-title mb-4">
                    <div class="title is-5">
                        {{ translations.settingsUserInputTitle }}
                    </div>
                </div>

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

            </div class="settings__options-container">
        </div class="box">
        <div class="box">
            <div class="settings__options-container">

                <div class="settings__setting-content-item-title mb-4">
                    <div class="title is-5">
                        {{ translations.settingsSearchResultsBoxTitle }}
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
                    <div class="settings__option-name">{{ translations.colorThemeSearchResultsItemActiveDescriptionColor }}</div>
                    <div class="settings__option-content">
                        <div class="field has-addons has-addons-right">
                            <div class="control">
                                <button
                                    class="button preview-button"
                                    :style="getPreviewColor(config.colorThemeOptions.searchResultsItemActiveDescriptionColor)"
                                    @click="editColor('searchResultsItemActiveDescriptionColor', config.colorThemeOptions.searchResultsItemActiveDescriptionColor)"
                                    >
                                </button>
                            </div>
                            <div class="control">
                                <input
                                    class="input font-mono"
                                    type="text"
                                    v-model="config.colorThemeOptions.searchResultsItemActiveDescriptionColor"
                                    @change="updateConfig"
                                    >
                            </div>
                            <div class="control">
                                <button class="button" @click="resetSearchResultsItemActiveDescriptionColor">
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

            </div class="settings__options-container">
        </div class="box">
        <div class="box">
            <div class="settings__options-container">

                <div class="settings__setting-content-item-title mb-4">
                    <div class="title is-5">
                        {{ translations.settingsScrollbarTitle }}
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
            </div class="settings__options-container">
        </div class="box">

        <color-picker :translations="translations"></color-picker>
    </div>
    `,
});
