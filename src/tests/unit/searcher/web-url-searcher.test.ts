import { Config } from "../../../ts/config";
import { SearchResultItem } from "../../../ts/search-result-item";
import { WebUrlSearcher } from "../../../ts/searcher/web-url-searcher";
import { InputOutputCombination } from "../test-helpers";

describe(WebUrlSearcher.name, (): void => {
    const searcher = new WebUrlSearcher();

    describe(searcher.getSearchResult.name, (): void => {
        it("should return a correct search result", (): void => {
            const combinations = [
                {
                    input: `google.com`,
                    output: {
                        executionArgument: "http://google.com",
                        name: "Open default browser",
                    } as SearchResultItem,
                } as InputOutputCombination,
                {
                    input: "https://google.com",
                    output: {
                        executionArgument: "https://google.com",
                        name: "Open default browser",
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
