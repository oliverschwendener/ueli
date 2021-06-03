import { GeneralOptions, defaultGeneralOptions } from "./general-options";
import { SearchEngineOptions, defaultSearchEngineOptions } from "./search-engine-options";
import { AppearanceOptions, defaultAppearanceOptions } from "./appearance-options";
import { ShortcutOptions, defaultShortcutOptions } from "./shortcuts-options";
import { EverythingSearchOptions, defaultEverythingSearchOptions } from "./everything-search-options";
import { MdFindOptions, defaultMdfindOptions } from "./mdfind-options";
import { TranslationOptions, defaultTranslationOptions } from "./translation-options";
import { WebSearchOptions, defaultWebSearchOptions } from "./websearch-options";
import { ColorThemeOptions, defaultColorThemeOptions } from "./color-theme-options";
import { FileBrowserOptions, defaultFileBrowserOptions } from "./filebrowser-options";
import {
    OperatingSystemCommandsOptions,
    defaultOperatingSystemCommandsOptions,
} from "./operating-system-commands-options";
import { CalculatorOptions, defaultCalculatorOptions } from "./calculator-options";
import { UrlOptions, defaultUrlOptions } from "./url-options";
import { EmailOptions, defaultEmailOptions } from "./email-options";
import { CurrencyConverterOptions, defaultCurrencyConverterOptions } from "./currency-converter-options";
import { WorkflowOptions, defaultWorkflowOptions } from "./workflow-options";
import { CommandlineOptions, defaultCommandlineOptions } from "./commandline-options";
import {
    OperatingSystemSettingsOptions,
    defaultOperatingSystemSettingsOptions,
} from "./operating-system-settings-options";
import { SimpleFolderSearchOptions, defaultSimpleFolderSearchOptions } from "./simple-folder-search-options";
import { UwpSearchOptions, defaultUwpSearchOptions } from "./uwp-search-options";
import { ColorConverterOptions, defaultColorConverterOptions } from "./color-converter-options";
import { ApplicationSearchOptions, defaultApplicationSearchOptions } from "./application-search-options";
import { defaultDictionaryOptions, DictionaryOptions } from "./dictionary-options";
import { BrowserBookmarksOptions, defaultBrowserBookmarksOptions } from "./browser-bookmarks-options";
import { ControlPanelOptions, defaultControlPanelOptions } from "./control-panel-options";

export interface UserConfigOptions {
    appearanceOptions: AppearanceOptions;
    colorThemeOptions: ColorThemeOptions;
    applicationSearchOptions: ApplicationSearchOptions;
    everythingSearchOptions: EverythingSearchOptions;
    dictionaryOptions: DictionaryOptions;
    mdfindOptions: MdFindOptions;
    searchEngineOptions: SearchEngineOptions;
    shortcutOptions: ShortcutOptions;
    translationOptions: TranslationOptions;
    generalOptions: GeneralOptions;
    websearchOptions: WebSearchOptions;
    fileBrowserOptions: FileBrowserOptions;
    operatingSystemCommandsOptions: OperatingSystemCommandsOptions;
    operatingSystemSettingsOptions: OperatingSystemSettingsOptions;
    calculatorOptions: CalculatorOptions;
    urlOptions: UrlOptions;
    emailOptions: EmailOptions;
    currencyConverterOptions: CurrencyConverterOptions;
    workflowOptions: WorkflowOptions;
    commandlineOptions: CommandlineOptions;
    simpleFolderSearchOptions: SimpleFolderSearchOptions;
    colorConverterOptions: ColorConverterOptions;
    uwpSearchOptions: UwpSearchOptions;
    browserBookmarksOptions: BrowserBookmarksOptions;
    controlPanelOptions: ControlPanelOptions;
}

export const defaultUserConfigOptions: UserConfigOptions = {
    appearanceOptions: defaultAppearanceOptions,
    applicationSearchOptions: defaultApplicationSearchOptions,
    browserBookmarksOptions: defaultBrowserBookmarksOptions,
    calculatorOptions: defaultCalculatorOptions,
    colorConverterOptions: defaultColorConverterOptions,
    colorThemeOptions: defaultColorThemeOptions,
    commandlineOptions: defaultCommandlineOptions,
    controlPanelOptions: defaultControlPanelOptions,
    currencyConverterOptions: defaultCurrencyConverterOptions,
    dictionaryOptions: defaultDictionaryOptions,
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
