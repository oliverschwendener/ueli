import Vue from "vue";
import { VueEventChannels } from "../vue-event-channels";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { Settings } from "./settings";
import { SettingOsSpecific } from "./settings-os-specific";
import { TranslationSet } from "../../common/translation/translation-set";

export const settingMenuItemComponent = Vue.extend({
    data() {
        return {
            isActive: false,
        };
    },
    methods: {
        getItemName(item: Settings | SettingOsSpecific) {
            const translations: TranslationSet = this.translations;
            switch (item) {
                case Settings.Appearance:
                    return translations.appearanceSettings;
                case Settings.ColorTheme:
                    return translations.colorThemeSettings;
                case Settings.ApplicationSearch:
                    return translations.applicationSearchSettings;
                case Settings.General:
                    return translations.generalSettings;
                case Settings.SearchEngine:
                    return translations.searchEngineSettings;
                case Settings.Shortcuts:
                    return translations.shortcutSettings;
                case Settings.Translation:
                    return translations.translationSettingsTranslation;
                case Settings.WebSearch:
                    return translations.websearch;
                case Settings.FileBrowser:
                    return translations.fileBrowser;
                case SettingOsSpecific.Everything:
                    return translations.everythingSearch;
                case SettingOsSpecific.MdFind:
                    return translations.mdfindSearch;
                default:
                    return item;
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
                {{ getItemName(item) }}
            </a>
        </li>
    `,
});
