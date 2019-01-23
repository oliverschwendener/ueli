import { SearchResultItem } from "../search-result-item";
import { Searcher } from "./searcher";
import { CalculatorHelper } from "../helpers/calculator-helper";
import { IconSet } from "../icon-sets/icon-set";
import { Calculator } from "../calculator/calculator";

export class CalculatorSearcher implements Searcher {
    public readonly blockOthers = false;
    private readonly iconSet: IconSet;
    private readonly precision: number;

    constructor(iconSet: IconSet, precision: number) {
        this.iconSet = iconSet;
        this.precision = precision;
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        const result = Calculator.calculate(userInput, this.precision);

        return [
            {
                description: "Press enter to copy to clipboard",
                executionArgument: CalculatorHelper.getExecutionArgument(result),
                icon: this.iconSet.calculatorIcon,
                name: `= ${result}`,
                searchable: [],
                tags: [],
            } as SearchResultItem,
        ];
    }
}
