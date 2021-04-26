import { ExecutionPlugin } from "../../execution-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { Calculator } from "./calculator";
import { CalculatorOptions } from "../../../common/config/calculator-options";
import { defaultCalculatorIcon } from "../../../common/icon/default-icons";
import { GeneralOptions } from "../../../common/config/general-options";

export class CalculatorPlugin implements ExecutionPlugin {
    public pluginType = PluginType.Calculator;
    private config: CalculatorOptions;
    private generalConfig: GeneralOptions;
    private translationSet: TranslationSet;
    private readonly clipboardCopier: (value: string) => Promise<void>;

    constructor(
        config: UserConfigOptions,
        translationSet: TranslationSet,
        clipboardCopier: (value: string) => Promise<void>,
    ) {
        this.config = config.calculatorOptions;
        this.generalConfig = config.generalOptions;
        this.translationSet = translationSet;
        this.clipboardCopier = clipboardCopier;
    }

    public isValidUserInput(userInput: string, fallback?: boolean | undefined): boolean {
        return Calculator.isValidInput(userInput, this.generalConfig.decimalSeparator, this.getArgumentSeparator());
    }

    private getArgumentSeparator() {
        if (this.generalConfig.decimalSeparator !== ",") {
            return ",";
        }
        return ";";
    }

    public getSearchResults(userInput: string, fallback?: boolean | undefined): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            const result = Calculator.calculate(
                userInput,
                Number(this.config.precision),
                this.generalConfig.decimalSeparator,
                this.getArgumentSeparator(),
            );
            resolve([
                {
                    description: this.translationSet.calculatorCopyToClipboard,
                    executionArgument: result,
                    hideMainWindowAfterExecution: true,
                    icon: defaultCalculatorIcon,
                    name: `= ${result}`,
                    originPluginType: this.pluginType,
                    searchable: [],
                },
            ]);
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
            this.generalConfig = updatedConfig.generalOptions;
            this.translationSet = translationSet;
            resolve();
        });
    }
}
