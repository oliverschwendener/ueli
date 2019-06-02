import { ExecutionPlugin } from "../../execution-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { AutoCompletionResult } from "../../../common/auto-completion-result";
import { TranslationSet } from "../../../common/translation/translation-set";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { CurrencyCode } from "./currency-code";
import { CurrencyConverterOptions } from "../../../common/config/currency-converter-options";
import { CurrencyConverter } from "./currency-converter";
import { CurrencyConversion } from "./currency-conversion";
import { defaultCurrencyExchangeIcon } from "../../../common/icon/default-icons";

export class CurrencyConverterPlugin implements ExecutionPlugin {
    public readonly pluginType = PluginType.CurrencyConverter;
    public readonly openLocationSupported = false;
    public readonly autoCompletionSupported = false;
    private config: CurrencyConverterOptions;
    private translationSet: TranslationSet;
    private readonly clipboardCopier: (value: string) => Promise<void>;

    constructor(config: CurrencyConverterOptions, translationSet: TranslationSet, clipboardCopier: (value: string) => Promise<void>) {
        this.config = config;
        this.translationSet = translationSet;
        this.clipboardCopier = clipboardCopier;
    }

    public isValidUserInput(userInput: string, fallback?: boolean | undefined): boolean {
        const words = userInput.trim().split(" ");
        try {
            const isValidInput = words.length === 4 &&
                !isNaN(Number(words[0])) &&
                this.isCurrencyCode(words[1]) &&
                words[2] === "in" &&
                this.isCurrencyCode(words[3]);
            return isValidInput;
        } catch (error) {
            return false;
        }
    }

    public async getSearchResults(userInput: string, fallback?: boolean | undefined): Promise<SearchResultItem[]> {
        const conversion = this.buildCurrencyConversion(userInput);
        try {
            const converted = await CurrencyConverter.convert(conversion, Number(this.config.precision));
            return [{
                description: this.translationSet.currencyConverterCopyToClipboard,
                executionArgument: converted.toString(),
                hideMainWindowAfterExecution: true,
                icon: defaultCurrencyExchangeIcon,
                name: `= ${converted} ${conversion.target}`,
                originPluginType: this.pluginType,
                searchable: [],
            }];
        } catch (error) {
            return error;
        }
    }

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        return this.clipboardCopier(searchResultItem.executionArgument);
    }

    public openLocation(searchResultItem: SearchResultItem): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public autoComplete(searchResultItem: SearchResultItem): Promise<AutoCompletionResult> {
        throw new Error("Method not implemented.");
    }

    public async updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        this.config = updatedConfig.currencyConverterOptions;
        this.translationSet = translationSet;
    }

    private isCurrencyCode(value: string): boolean {
        return Object
            .values(CurrencyCode)
            .some((c: CurrencyCode) => c.toLowerCase() === value.toLowerCase());
    }

    private buildCurrencyConversion(userInput: string): CurrencyConversion {
        const words = userInput.split(" ");
        return {
            base: Object.values(CurrencyCode).find((c: CurrencyCode) => c.toLowerCase() === words[1].toLowerCase()) || CurrencyCode.EUR,
            target: Object.values(CurrencyCode).find((c: CurrencyCode) => c.toLowerCase() === words[3].toLowerCase()) || CurrencyCode.USD,
            value: Number(words[0]),
        };
    }
}
