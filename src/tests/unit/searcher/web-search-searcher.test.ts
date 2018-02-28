import { Config } from "../../../ts/config";
import { SearchResultItem } from "../../../ts/search-result-item";
import { WebSearchSearcher } from "../../../ts/searcher/web-search-searcher";
import { InputOutputCombination } from "../test-helpers";

describe(WebSearchSearcher.name, (): void => {
    const searcher = new WebSearchSearcher();
    const webSearches = Config.webSearches;

    describe(searcher.getSearchResult.name, (): void => {
        for (const webSearch of webSearches) {
            it(`${webSearch.name} web search should return a correct search result`, (): void => {
                const combinations = [
                    {
                        input: `${webSearch.prefix}${Config.webSearchSeparator}google-some-thing`,
                        output: {
                            executionArgument: `${webSearch.url}google-some-thing`,
                            name: `Search ${webSearch.name} for 'google-some-thing'`,
                        } as SearchResultItem,
                    } as InputOutputCombination,
                    {
                        input: `${webSearch.prefix}${Config.webSearchSeparator}`,
                        output: {
                            executionArgument: `${webSearch.url}`,
                            name: `Search ${webSearch.name}`,
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
        }
    });
});
