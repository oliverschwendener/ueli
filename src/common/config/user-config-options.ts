import { ApplicationSearchOptions } from "../../main/plugins/application-search-plugin/application-search-options";
import { GeneralOptions } from "./general-options";
import { SearchEngineOptions } from "./search-engine-options";
import { AppearanceOptions } from "./appearance-options";
import { ShortcutOptions } from "./shortcuts-options";
import { EverythingSearchOptions } from "./everything-search-options";
import { MdFindOptions } from "./mdfind-options";
import { TranslationOptions } from "./translation-options";
import { WebSearchOptions } from "./websearch-options";
import { ColorThemeOptions } from "./color-theme-options";
import { FileBrowserOptions } from "./filebrowser-options";
import { OperatingSystemCommandsOptions } from "./operating-system-commands-options";
import { CalculatorOptions } from "./calculator-options";
import { UrlOptions } from "./url-options";
import { EmailOptions } from "./email-options";
import { CurrencyConverterOptions } from "./currency-converter-options";

export interface UserConfigOptions {
    appearanceOptions: AppearanceOptions;
    colorThemeOptions: ColorThemeOptions;
    applicationSearchOptions: ApplicationSearchOptions;
    everythingSearchOptions: EverythingSearchOptions;
    mdfindOptions: MdFindOptions;
    searchEngineOptions: SearchEngineOptions;
    shortcutOptions: ShortcutOptions;
    translationOptions: TranslationOptions;
    generalOptions: GeneralOptions;
    websearchOptions: WebSearchOptions;
    fileBrowserOptions: FileBrowserOptions;
    operatingSystemCommandsOptions: OperatingSystemCommandsOptions;
    calculatorOptions: CalculatorOptions;
    urlOptions: UrlOptions;
    emailOptions: EmailOptions;
    currencyConverterOptions: CurrencyConverterOptions;
}
