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
import { GeneralOptions } from "../../../common/config/general-options";

export class CurrencyConverterPlugin implements ExecutionPlugin {
    public readonly pluginType = PluginType.CurrencyConverter;
    private config: CurrencyConverterOptions;
    private generalConfig: GeneralOptions;
    private translationSet: TranslationSet;
    private readonly clipboardCopier: (value: string) => Promise<void>;

    constructor(
        config: UserConfigOptions,
        translationSet: TranslationSet,
        clipboardCopier: (value: string) => Promise<void>,
    ) {
        this.config = config.currencyConverterOptions;
        this.generalConfig = config.generalOptions;
        this.translationSet = translationSet;
        this.clipboardCopier = clipboardCopier;
    }

    public isValidUserInput(userInput: string, fallback?: boolean | undefined): boolean {
        const keywords = ["in", "to"];
        const words = userInput.trim().split(" ");
        if (words.length === 3) {
            try {
                return (
                    !isNaN(this.getNumber(words[0])) &&
                    this.isCurrencyCode(words[1]) &&
                    this.isCurrencyCode(words[2])
                );
            } catch (err) {
                return false;
            }
        } else if (words.length === 4) {
            try {
                return (
                    keywords.includes(words[2].toLowerCase()) &&
                    !isNaN(this.getNumber(words[0])) &&
                    this.isCurrencyCode(words[1]) &&
                    this.isCurrencyCode(words[3])
                );
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
                    const convertedString = this.convertToString(converted);
                    const result: SearchResultItem = {
                        description: this.translationSet.currencyConverterCopyToClipboard,
                        executionArgument: convertedString,
                        hideMainWindowAfterExecution: true,
                        icon: defaultCurrencyExchangeIcon,
                        name: `= ${convertedString} ${conversion.target}`,
                        originPluginType: this.pluginType,
                        searchable: [],
                    };
                    resolve([result]);
                })
                .catch((err) => reject(err));
        });
    }

    private getNumber(numericStringValue: string): number {
        if (this.generalConfig.decimalSeparator === ".") {
            return Number(numericStringValue);
        }
        return Number(numericStringValue.replaceAll(this.generalConfig.decimalSeparator, "."));
    }

    private convertToString(numericValue: number): string {
        if (this.generalConfig.decimalSeparator === ".") {
            return numericValue.toString();
        }
        return numericValue.toString().replace(".", this.generalConfig.decimalSeparator);
    }

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        return this.clipboardCopier(searchResultItem.executionArgument);
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig.currencyConverterOptions;
            this.generalConfig = updatedConfig.generalOptions;
            this.translationSet = translationSet;
            resolve();
        });
    }

    private isCurrencyCode(value: string): boolean {
        return Object.values(CurrencyCode).some((c: CurrencyCode) => c.toLowerCase() === value.toLowerCase());
    }

    private buildCurrencyConversion(userInput: string): CurrencyConversion {
        const words = userInput.trim().split(" ");
        if (words.length === 3) {
            return {
                base:
                    Object.values(CurrencyCode).find((c: CurrencyCode) => c.toLowerCase() === words[1].toLowerCase()) ||
                    CurrencyCode.EUR,
                target:
                    Object.values(CurrencyCode).find((c: CurrencyCode) => c.toLowerCase() === words[2].toLowerCase()) ||
                    CurrencyCode.USD,
                value: this.getNumber(words[0]),
            };
        } else{
            return {
                base:
                    Object.values(CurrencyCode).find((c: CurrencyCode) => c.toLowerCase() === words[1].toLowerCase()) ||
                    CurrencyCode.EUR,
                target:
                    Object.values(CurrencyCode).find((c: CurrencyCode) => c.toLowerCase() === words[3].toLowerCase()) ||
                    CurrencyCode.USD,
                value: this.getNumber(words[0]),
            };
        }
    }
}
