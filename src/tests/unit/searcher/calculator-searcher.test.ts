import { SearchResultItem } from "../../../ts/search-result-item";
import { CalculatorSearcher } from "../../../ts/searcher/calculator-searcher";
import { InputOutputCombination } from "../test-helpers";

describe(CalculatorSearcher.name, (): void => {
    const searcher = new CalculatorSearcher();

    describe(searcher.getSearchResult.name, (): void => {
        it("should return a correct search result", (): void => {
            const combinations = [
                {
                    input: `[[1,2,3] * 2, [4,5,6]] + [[6,7,8],[9,10,11]]`,
                    output: {
                        executionArgument: "",
                        name: "= [[8, 11, 14], [13, 15, 17]]",
                    } as SearchResultItem,
                } as InputOutputCombination,
                {
                    input: "pow(2,6) == 2^(re(10i + 6))",
                    output: {
                        executionArgument: "",
                        name: "= true",
                    } as SearchResultItem,
                } as InputOutputCombination,
            ];

            for (const combination of combinations) {
                const actual = searcher.getSearchResult(combination.input);
                expect(actual.filter.length).toBe(1);
                expect(actual[0].name).toBe(combination.output.name);
                expect(actual[0].executionArgument).toBe(combination.output.executionArgument);
            }
        });
    });
});
