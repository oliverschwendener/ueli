import { ExecutionPlugin } from "../../execution-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { AutoCompletionResult } from "../../../common/auto-completion-result";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { Calculator } from "./calculator";
import { CalculatorOptions } from "../../../common/config/calculator-options";
import { defaultCalculatorIcon } from "../../../common/icon/default-icons";

export class CalculatorPlugin implements ExecutionPlugin {
    public pluginType = PluginType.Calculator;
    public openLocationSupported = false;
    public autoCompletionSupported = false;
    private config: CalculatorOptions;
    private translationSet: TranslationSet;
    private readonly clipboardCopier: (value: string) => Promise<void>;

    constructor(config: CalculatorOptions, translationSet: TranslationSet, clipboardCopier: (value: string) => Promise<void>) {
        this.config = config;
        this.translationSet = translationSet;
        this.clipboardCopier = clipboardCopier;
    }

    public isValidUserInput(userInput: string, fallback?: boolean | undefined): boolean {
        return Calculator.isValidInput(userInput);
    }

    public getSearchResults(userInput: string, fallback?: boolean | undefined): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            const result = Calculator.calculate(userInput, Number(this.config.precision));
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

    public openLocation(searchResultItem: SearchResultItem): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public autoComplete(searchResultItem: SearchResultItem): Promise<AutoCompletionResult> {
        throw new Error("Method not implemented.");
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig.calculatorOptions;
            this.translationSet = translationSet;
            resolve();
        });
    }
}
