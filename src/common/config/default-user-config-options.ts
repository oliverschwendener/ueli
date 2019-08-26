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
import { defaultWorkflowOptions } from "./default-workflow-options";
import { defaultCommandlineOptions } from "./default-commandline-options";
import { defaultOperatingSystemSettingsOptions } from "./default-operating-system-settings-options";
import { defaultSimpleFolderSearchOptions } from "./default-simple-folder-search-options";
import { defaultUwpSearchOptions } from "./default-uwp-search-options";
import { defaultColorConverterOptions } from "./default-color-converter-options";
import { defaultBrowserBookmarksOptions } from "./default-browser-bookmarks-options";

export const defaultUserConfigOptions: UserConfigOptions = {
    appearanceOptions: defaultAppearanceOptions,
    applicationSearchOptions: defaultApplicationSearchOptions,
    browserBookmarksOptions: defaultBrowserBookmarksOptions,
    calculatorOptions: defaultCalculatorOptions,
    colorConverterOptions: defaultColorConverterOptions,
    colorThemeOptions: defaultColorThemeOptions,
    commandlineOptions: defaultCommandlineOptions,
    currencyConverterOptions: defaultCurrencyConverterOptions,
    emailOptions: defaultEmailOptions,
    everythingSearchOptions: defaultEverythingSearchOptions,
    fileBrowserOptions: defaultFileBrowserOptions,
    generalOptions: defaultGeneralOptions,
    mdfindOptions: defaultMdfindOptions,
    operatingSystemCommandsOptions: defaultOperatingSystemCommandsOptions,
    operatingSystemSettingsOptions: defaultOperatingSystemSettingsOptions,
    searchEngineOptions: defaultSearchEngineOptions,
    shortcutOptions: defaultShortcutOptions,
    simpleFolderSearchOptions: defaultSimpleFolderSearchOptions,
    translationOptions: defaultTranslationOptions,
    urlOptions: defaultUrlOptions,
    uwpSearchOptions: defaultUwpSearchOptions,
    websearchOptions: defaultWebSearchOptions,
    workflowOptions: defaultWorkflowOptions,
};
