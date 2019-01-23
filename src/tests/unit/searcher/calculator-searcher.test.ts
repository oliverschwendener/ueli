import { SearchResultItem } from "../../../ts/search-result-item";
import { CalculatorSearcher } from "../../../ts/searcher/calculator-searcher";
import { InputOutputCombination } from "../test-helpers";
import { CalculatorHelper } from "../../../ts/helpers/calculator-helper";
import { testIconSet } from "../../../ts/icon-sets/test-icon-set";

describe(CalculatorSearcher.name, (): void => {
    const precision = 16;
    const searcher = new CalculatorSearcher(testIconSet, precision);

    describe(searcher.getSearchResult.name, (): void => {
        it("should return a correct search result", (): void => {
            const combinations: InputOutputCombination[] = [
                {
                    input: `[[1,2,3] * 2, [4,5,6]] + [[6,7,8],[9,10,11]]`,
                    output: {
                        executionArgument: CalculatorHelper.getExecutionArgument("[[8, 11, 14], [13, 15, 17]]"),
                        name: "= [[8, 11, 14], [13, 15, 17]]",
                    } as SearchResultItem,
                },
                {
                    input: "pow(2,6) == 2^(re(10i + 6))",
                    output: {
                        executionArgument: CalculatorHelper.getExecutionArgument("true"),
                        name: "= true",
                    } as SearchResultItem,
                },
                {
                    input: "1.1 - 1",
                    output: {
                        executionArgument: CalculatorHelper.getExecutionArgument("0.1"),
                        name: "= 0.1",
                    } as SearchResultItem,
                },
            ];

            for (const combination of combinations) {
                const actual = searcher.getSearchResult(combination.input);
                expect(actual.filter.length).toBe(1);
                expect(actual[0].name).toBe(combination.output.name);
                expect(actual[0].executionArgument).toBe(combination.output.executionArgument);
            }
        });

        it("should not block other searchers", (): void => {
            const actual = searcher.blockOthers;
            expect(actual).toBe(false);
        });
    });
});
