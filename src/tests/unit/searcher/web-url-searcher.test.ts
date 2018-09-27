import { SearchResultItem } from "../../../ts/search-result-item";
import { WebUrlSearcher } from "../../../ts/searcher/web-url-searcher";
import { InputOutputCombination } from "../test-helpers";
import { testIconSet } from "../../../ts/icon-sets/test-icon-set";

describe(WebUrlSearcher.name, (): void => {
    const searcher = new WebUrlSearcher(testIconSet);

    describe(searcher.getSearchResult.name, (): void => {
        it("should return a correct search result", (): void => {
            const combinations: InputOutputCombination[] = [
                {
                    input: "google.com",
                    output: {
                        executionArgument: "http://google.com",
                        name: "http://google.com",
                    } as SearchResultItem,
                },
                {
                    input: "https://google.com",
                    output: {
                        executionArgument: "https://google.com",
                        name: "https://google.com",
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
    });
});
