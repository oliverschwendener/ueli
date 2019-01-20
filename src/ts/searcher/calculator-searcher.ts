import { SearchResultItem } from "../search-result-item";
import { Searcher } from "./searcher";
import { CalculatorHelper } from "../helpers/calculator-helper";
import * as math from "mathjs";
import { IconSet } from "../icon-sets/icon-set";

math.config({ number: "BigNumber" });

export class CalculatorSearcher implements Searcher {
    public readonly blockOthers = false;

    private readonly iconSet: IconSet;

    constructor(iconSet: IconSet) {
        this.iconSet = iconSet;
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        const result = math.eval(userInput);

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
