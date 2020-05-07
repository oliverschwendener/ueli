import { ExecutionPlugin } from "../../execution-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { TranslationSet } from "../../../common/translation/translation-set";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { CurrencyCode } from "./currency-code";
import { CurrencyConverterOptions } from "../../../common/config/currency-converter-options";
import { CurrencyConverter } from "./currency-converter";
import { CurrencyConversion } from "./currency-conversion";
import { defaultCurrencyExchangeIcon } from "../../../common/icon/default-icons";

export class CurrencyConverterPlugin implements ExecutionPlugin {
    public readonly pluginType = PluginType.CurrencyConverter;
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
        if (words.length === 4) {
            try {
                return !isNaN(Number(words[0]))
                    && this.isCurrencyCode(words[1])
                    && words[2] === "in"
                    && this.isCurrencyCode(words[3]);
            } catch (err) {
                return false;
            }
        } else {
            return false;
        }
    }

    public getSearchResults(userInput: string, fallback?: boolean | undefined): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            const conversion = this.buildCurrencyConversion(userInput);
            CurrencyConverter.convert(conversion, Number(this.config.precision))
                .then((converted) => {
                    const result: SearchResultItem = {
                        description: this.translationSet.currencyConverterCopyToClipboard,
                        executionArgument: converted.toString(),
                        hideMainWindowAfterExecution: true,
                        icon: defaultCurrencyExchangeIcon,
                        name: `= ${this.thousands_separators(converted.toString())} ${conversion.target}`,
                        originPluginType: this.pluginType,
                        searchable: [],
                    };
                    resolve([result]);
                })
                .catch((err) => reject(err));
        });
    }

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        return this.clipboardCopier(searchResultItem.executionArgument);
    }

    thousands_separators(num: string) {
        const numParts = num.toString().split(".");
        numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.config.separator);
        return numParts.join(".");
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig.currencyConverterOptions;
            this.translationSet = translationSet;
            resolve();
        });
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
