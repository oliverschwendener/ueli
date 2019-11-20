import { ExecutionPlugin } from "../../execution-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { Calculator } from "./calculator";
import { CalculatorOptions } from "../../../common/config/calculator-options";
import { defaultCalculatorIcon } from "../../../common/icon/default-icons";

export class CalculatorPlugin implements ExecutionPlugin {
    public pluginType = PluginType.Calculator;
    private config: CalculatorOptions;
    private translationSet: TranslationSet;
    private readonly clipboardCopier: (value: string) => Promise<void>;

    constructor(config: CalculatorOptions, translationSet: TranslationSet, clipboardCopier: (value: string) => Promise<void>) {
        this.config = config;
        this.translationSet = translationSet;
        this.clipboardCopier = clipboardCopier;
    }

    public isValidUserInput(userInput: string, fallback?: boolean | undefined): boolean {
        return Calculator.isValidInput(this.getInputNumber(userInput));
    }

    public getSearchResults(userInput: string, fallback?: boolean | undefined): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            const result = Calculator.calculate(this.getInputNumber(userInput), Number(this.config.precision));

            resolve([{
                description: this.translationSet.calculatorCopyToClipboard,
                executionArgument: result,
                hideMainWindowAfterExecution: true,
                icon: defaultCalculatorIcon,
                name: `= ${result}`,
                originPluginType: this.pluginType,
                searchable: [],
            }]);
        });
    }

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        return this.clipboardCopier(searchResultItem.executionArgument);
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig.calculatorOptions;
            this.translationSet = translationSet;
            resolve();
        });
    }

    private getInputNumber(userInput: string): string {
        const inputWithoutCommas: string = userInput.replace(/,/g, ".");

        if (inputWithoutCommas.indexOf("(") === -1 && inputWithoutCommas.indexOf(")") === -1) {
            return inputWithoutCommas;
        } else {
            // replace all `.` to `,` in brackets
            return inputWithoutCommas.replace(/(\(.*?)\.(.*?\))/g, "$1,$2");
        }
    }
}
