import { expect } from "chai";
import { WebUrlSearcher } from "../../../src/ts/searcher/web-url-searcher";
import { InputOutputCombination } from "../test-helpers";
import { SearchResultItem } from "../../../src/ts/search-engine";
import { Config } from "../../../src/ts/config";

describe(WebUrlSearcher.name, (): void => {
    let searcher = new WebUrlSearcher();

    describe(searcher.getSearchResult.name, (): void => {
        it("should return a correct search result", (): void => {
            let combinations = [
                <InputOutputCombination>{
                    input: `google.com`,
                    output: <SearchResultItem>{
                        name: "Open default browser",
                        executionArgument: "http://google.com"
                    }
                },
                <InputOutputCombination>{
                    input: "https://google.com",
                    output: <SearchResultItem>{
                        name: "Open default browser",
                        executionArgument: "https://google.com"
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
    });
});
