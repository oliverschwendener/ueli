import { UserConfigOptions } from "./user-config-options";
import { defaultApplicationSearchOptions } from "../../main/plugins/application-search-plugin/default-application-search-plugin-options";
import { defaultGeneralOptions } from "./default-general-options";
import { defaultSearchEngineOptions } from "./default-search-engine-options";
import { defaultAppearanceOptions } from "./default-appearance-options";
import { defaultShortcutOptions } from "./default-shortcuts-options";
import { defaultEverythingSearchOptions } from "./default-everything-search-options";
import { defaultMdfindOptions } from "./default-mdfind-options";
import { defaultTranslationOptions } from "./default-translation-options";
import { defaultWebSearchOptions } from "./default-websearch-options";
import { defaultColorThemeOptions } from "./default-color-theme-options";
import { defaultFileBrowserOptions } from "./default-filebrowser-options";
import { defaultOperatingSystemCommandsOptions } from "./default-operating-system-commands-options";
import { defaultCalculatorOptions } from "./default-calculator-options";
import { defaultUrlOptions } from "./default-url-oprions";
import { defaultEmailOptions } from "./default-email-options";
import { defaultCurrencyConverterOptions } from "./default-currency-converter-options";

export const defaultUserConfigOptions: UserConfigOptions = {
    appearanceOptions: defaultAppearanceOptions,
    applicationSearchOptions: defaultApplicationSearchOptions,
    calculatorOptions: defaultCalculatorOptions,
    colorThemeOptions: defaultColorThemeOptions,
    currencyConverterOptions: defaultCurrencyConverterOptions,
    emailOptions: defaultEmailOptions,
    everythingSearchOptions: defaultEverythingSearchOptions,
    fileBrowserOptions: defaultFileBrowserOptions,
    generalOptions: defaultGeneralOptions,
    mdfindOptions: defaultMdfindOptions,
    operatingSystemCommandsOptions: defaultOperatingSystemCommandsOptions,
    searchEngineOptions: defaultSearchEngineOptions,
    shortcutOptions: defaultShortcutOptions,
    translationOptions: defaultTranslationOptions,
    urlOptions: defaultUrlOptions,
    websearchOptions: defaultWebSearchOptions,
};
