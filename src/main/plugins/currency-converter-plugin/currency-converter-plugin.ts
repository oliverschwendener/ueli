import { ExecutionPlugin } from "../../execution-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { AutoCompletionResult } from "../../../common/auto-completion-result";
import { TranslationSet } from "../../../common/translation/translation-set";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { CurrencyCode } from "./currency-code";
import axios from "axios";
import { defaultCurrencyExchangeIcon } from "../../../common/icon/default-icons";
import { CurrencyConverterOptions } from "../../../common/config/currency-converter-options";

interface CurrencyConversion {
    value: number;
    base: CurrencyCode;
    target: CurrencyCode;
}

interface ConversionRate {
    [key: string]: number;
}

interface ConversionApiResult {
    base: string;
    date: string;
    rates: ConversionRate;
}

export class CurrencyConverterPlugin implements ExecutionPlugin {
    public readonly pluginType: PluginType.CurrencyConverter;
    public readonly openLocationSupported = false;
    public readonly autoCompletionSupported = false;
    private config: CurrencyConverterOptions;
    private readonly clipboardCopier: (value: string) => Promise<void>;

    constructor(config: CurrencyConverterOptions, clipboardCopier: (value: string) => Promise<void>) {
        this.config = config;
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
            axios.get(`https://api.exchangeratesapi.io/latest?base=${conversion.base}`)
                .then((response) => {
                    const apiResult: ConversionApiResult = response.data;
                    const targetKey = Object.keys(apiResult.rates).find((r) => r.toLowerCase() === conversion.target.toLowerCase());
                    if (targetKey) {
                        const rate = Number(apiResult.rates[targetKey]);
                        const converted = Number.parseFloat(`${conversion.value * rate}`).toFixed(Number(this.config.precision));
                        const result: SearchResultItem = {
                            description: `1 ${conversion.base} = ${rate} ${conversion.target}`,
                            executionArgument: converted.toString(),
                            hideMainWindowAfterExecution: true,
                            icon: defaultCurrencyExchangeIcon,
                            name: `= ${converted} ${conversion.target}`,
                            originPluginType: this.pluginType,
                            searchable: [],
                        };
                        resolve([result]);
                    }
                    reject(`No conversion rate found for ${conversion.target}`);
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

    public openLocation(searchResultItem: SearchResultItem): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public autoComplete(searchResultItem: SearchResultItem): Promise<AutoCompletionResult> {
        throw new Error("Method not implemented.");
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig.currencyConverterOptions;
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
