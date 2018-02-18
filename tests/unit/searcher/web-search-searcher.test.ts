import { expect } from "chai";
import { WebSearchSearcher } from "../../../src/ts/searcher/web-search-searcher";
import { InputOutputCombination } from "../test-helpers";
import { SearchResultItem } from "../../../src/ts/search-engine";
import { Config } from "../../../src/ts/config";

describe(WebSearchSearcher.name, (): void => {
    let searcher = new WebSearchSearcher();
    let webSearches = Config.webSearches;

    describe(searcher.getSearchResult.name, (): void => {
        for (let webSearch of webSearches) {
            it(`${webSearch.name} web search should return a correct search result`, (): void => {
                let combinations = [
                    <InputOutputCombination>{
                        input: `${webSearch.prefix}${Config.webSearchSeparator}google-some-thing`,
                        output: <SearchResultItem>{
                            name: `Search ${webSearch.name} for 'google-some-thing'`,
                            executionArgument: `${webSearch.url}google-some-thing`,
                        }
                    },
                    <InputOutputCombination>{
                        input: `${webSearch.prefix}${Config.webSearchSeparator}`,
                        output: <SearchResultItem>{
                            name: `Search ${webSearch.name}`,
                            executionArgument: `${webSearch.url}`
                        }
                    }
                ];

                for (let combination of combinations) {
                    let actual = searcher.getSearchResult(combination.input);
                    expect(actual.filter.length).to.equal(1);
                    expect(actual[0].name).to.equal(combination.output.name);
                    expect(actual[0].executionArgument).to.equal(combination.output.executionArgument);
                }
            });
        }
    });
});
