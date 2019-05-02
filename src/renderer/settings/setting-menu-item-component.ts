import Vue from "vue";
import { VueEventChannels } from "../vue-event-channels";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { PluginSettings } from "./plugin-settings";
import { SettingOsSpecific } from "./settings-os-specific";
import { TranslationSet } from "../../common/translation/translation-set";
import { GeneralSettings } from "./general-settings";

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
                case GeneralSettings.ColorTheme:
                    return translations.colorThemeSettings;
                case GeneralSettings.General:
                    return translations.generalSettings;
                case GeneralSettings.SearchEngine:
                    return translations.searchEngineSettings;
                case PluginSettings.ApplicationSearch:
                    return translations.applicationSearchSettings;
                case PluginSettings.Shortcuts:
                    return translations.shortcutSettings;
                case PluginSettings.Translation:
                    return translations.translationSettingsTranslation;
                case PluginSettings.WebSearch:
                    return translations.websearch;
                case PluginSettings.FileBrowser:
                    return translations.fileBrowser;
                case PluginSettings.OperatingSystemCommands:
                    return translations.operatingSystemCommands;
                case PluginSettings.Calculator:
                    return translations.calcuator;
                case PluginSettings.Url:
                    return translations.url;
                case PluginSettings.Email:
                    return translations.email;
                case PluginSettings.CurrencyConverter:
                    return translations.currencyConverter;
                case PluginSettings.Commandline:
                    return translations.commandline;
                case SettingOsSpecific.Everything:
                    return translations.everythingSearch;
                case SettingOsSpecific.MdFind:
                    return translations.mdfindSearch;
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
        showSetting() {
            vueEventDispatcher.$emit(VueEventChannels.showSetting, this.item);
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.showSetting, (item: string) => {
            this.isActive = this.item === item;
        });
    },
    props: ["item", "translations"],
    template: `
        <li @click="showSetting">
            <a :class="{ 'is-active' : isActive }">
                <span v-if="getItemIcon(item).length > 0" class="icon" v-html="getItemIcon(item)"></span>
                <span>{{ getItemName(item) }}</span>
            </a>
        </li>
    `,
});
