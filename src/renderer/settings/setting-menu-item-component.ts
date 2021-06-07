import Vue from "vue";
import { VueEventChannels } from "../vue-event-channels";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { PluginSettings } from "./plugin-settings";
import { SettingOsSpecific } from "./settings-os-specific";
import { TranslationSet } from "../../common/translation/translation-set";
import { GeneralSettings } from "./general-settings";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { platform } from "os";

export const settingMenuItemComponent = Vue.extend({
    data() {
        return {
            isActive: false,
        };
    },
    methods: {
        getItemName(item: GeneralSettings | PluginSettings | SettingOsSpecific) {
            const translations: TranslationSet = this.translations;
            switch (item) {
                case GeneralSettings.Appearance:
                    return translations.appearanceSettings;
                case GeneralSettings.General:
                    return translations.generalSettings;
                case GeneralSettings.SearchEngine:
                    return translations.searchEngineSettings;
                case PluginSettings.ApplicationSearch:
                    return translations.applicationSearchSettings;
                case PluginSettings.BrowserBookmarks:
                    return translations.browserBookmarks;
                case PluginSettings.Calculator:
                    return translations.calcuator;
                case PluginSettings.ColorConverter:
                    return translations.colorConverter;
                case GeneralSettings.ColorTheme:
                    return translations.colorThemeSettings;
                case PluginSettings.CurrencyConverter:
                    return translations.currencyConverter;
                case PluginSettings.Commandline:
                    return translations.commandline;
                case PluginSettings.Dictionary:
                    return translations.dictionary;
                case PluginSettings.Email:
                    return translations.email;
                case PluginSettings.FileBrowser:
                    return translations.fileBrowser;
                case PluginSettings.OperatingSystemCommands:
                    return translations.operatingSystemCommands;
                case PluginSettings.OperatingSystemSettings:
                    return translations.operatingSystemSettings;
                case PluginSettings.Shortcuts:
                    return translations.shortcutSettings;
                case PluginSettings.SimpleFolderSearch:
                    return translations.simpleFolderSearch;
                case PluginSettings.Translation:
                    return translations.translationSettingsTranslation;
                case PluginSettings.Url:
                    return translations.url;
                case PluginSettings.WebSearch:
                    return translations.websearch;
                case PluginSettings.Workflow:
                    return translations.workflows;
                case SettingOsSpecific.ControlPanel.replace(`${platform()}:`, ""):
                    return translations.controlPanel;
                case SettingOsSpecific.Everything.replace(`${platform()}:`, ""):
                    return translations.everythingSearch;
                case SettingOsSpecific.MdFind.replace(`${platform()}:`, ""):
                    return translations.mdfindSearch;
                case SettingOsSpecific.Uwp.replace(`${platform()}:`, ""):
                    return "UWP";
                default:
                    return item;
            }
        },
        getItemIcon(item: GeneralSettings): string {
            switch (item) {
                case GeneralSettings.Appearance:
                    return `<i class="fas fa-eye"></i>`;
                case GeneralSettings.ColorTheme:
                    return `<i class="fas fa-palette"></i>`;
                case GeneralSettings.General:
                    return `<i class="fas fa-cog"></i>`;
                case GeneralSettings.SearchEngine:
                    return `<i class="fas fa-search"></i>`;
                default:
                    return "";
            }
        },
        isEnabled(item: GeneralSettings | PluginSettings | SettingOsSpecific): boolean {
            const config: UserConfigOptions = this.config;
            switch (item) {
                case PluginSettings.ApplicationSearch:
                    return config.applicationSearchOptions.enabled;
                case PluginSettings.BrowserBookmarks:
                    return config.browserBookmarksOptions.isEnabled;
                case PluginSettings.Calculator:
                    return config.calculatorOptions.isEnabled;
                case PluginSettings.ColorConverter:
                    return config.colorConverterOptions.isEnabled;
                case PluginSettings.Commandline:
                    return config.commandlineOptions.isEnabled;
                case PluginSettings.CurrencyConverter:
                    return config.currencyConverterOptions.isEnabled;
                case PluginSettings.Dictionary:
                    return config.dictionaryOptions.isEnabled;
                case PluginSettings.Email:
                    return config.emailOptions.isEnabled;
                case PluginSettings.FileBrowser:
                    return config.fileBrowserOptions.isEnabled;
                case PluginSettings.OperatingSystemCommands:
                    return config.operatingSystemCommandsOptions.isEnabled;
                case PluginSettings.OperatingSystemSettings:
                    return config.operatingSystemSettingsOptions.isEnabled;
                case PluginSettings.Shortcuts:
                    return config.shortcutOptions.isEnabled;
                case PluginSettings.SimpleFolderSearch:
                    return config.simpleFolderSearchOptions.isEnabled;
                case PluginSettings.Translation:
                    return config.translationOptions.enabled;
                case PluginSettings.Url:
                    return config.urlOptions.isEnabled;
                case PluginSettings.WebSearch:
                    return config.websearchOptions.isEnabled;
                case PluginSettings.Workflow:
                    return config.workflowOptions.isEnabled;
                case SettingOsSpecific.ControlPanel.replace(`${platform()}:`, ""):
                    return config.controlPanelOptions.isEnabled;
                case SettingOsSpecific.Everything.replace(`${platform()}:`, ""):
                    return config.everythingSearchOptions.enabled;
                case SettingOsSpecific.MdFind.replace(`${platform()}:`, ""):
                    return config.mdfindOptions.enabled;
                case SettingOsSpecific.Uwp.replace(`${platform()}:`, ""):
                    return config.uwpSearchOptions.isEnabled;
                default:
                    return false;
            }
        },
        isPluginSetting(item: GeneralSettings | PluginSettings | SettingOsSpecific): boolean {
            const allPluginSettings = [
                ...Object.values(PluginSettings).map((setting) => setting.toString()),
                ...Object.values(SettingOsSpecific).map((setting) => setting.toString().replace(`${platform()}:`, "")),
            ];

            return allPluginSettings.find((setting) => setting === item) !== undefined;
        },
        showSetting() {
            vueEventDispatcher.$emit(VueEventChannels.showSetting, this.item);
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.showSetting, (item: string) => {
            this.isActive = this.item === item;
        });
    },
    props: ["item", "translations", "config"],
    template: `
        <li @click="showSetting">
            <a :class="{ 'is-active' : isActive }">
                <div class="settings__sidebar-name-container">
                    <span v-if="getItemIcon(item).length > 0" class="icon" v-html="getItemIcon(item)"></span>
                    <span class="settings__sidebar-name">
                        {{ getItemName(item) }}
                    </span>
                    <span v-if="isPluginSetting(item)" class="is-size-7" :class="{ 'has-text-success' : isEnabled(item), 'has-text-danger' : !isEnabled(item) }">
                        <i class="fas fa-circle"></i>
                    </span>
                </div>
            </a>
        </li>
    `,
});
