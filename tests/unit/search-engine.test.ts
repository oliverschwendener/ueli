import { expect } from "chai";
import { SearchEngine, SearchResultItem } from "./../../src/ts/search-engine";

function getFakeItems(items: string[]): SearchResultItem[] {
    return items.map((i): SearchResultItem => {
        return <SearchResultItem>{
            name: i,
            executionArgument: i,
            tags: [i]
        }
    })
}

describe("SearchEngine", (): void => {
    describe("search", (): void => {
        it("should return more than 0 search result items", (): void => {
            let fakeItems = getFakeItems(["abc", "abcd", "abcde"]);
            let searchEngine = new SearchEngine(fakeItems);
            let userInput = "abc";

            let actual = searchEngine.search(userInput);

            expect(actual.length).to.be.greaterThan(0);
        });

        it("should return empty array when user input doesnt match any of the plugin items", (): void => {
            let fakeItems = getFakeItems(["abc", "abcd", "abcde"]);
            let searchEngine = new SearchEngine(fakeItems);
            let userInput = "xyz";

            let actual = searchEngine.search(userInput);

            expect(actual.length).to.eql(0);
        });

        it("should return the search result ordered by score", (): void => {
            let fakeItems = getFakeItems(["hans", "nhas", "hasn"]);
            let searchEngine = new SearchEngine(fakeItems);
            let userInput = "han";

            let actual = searchEngine.search(userInput);

            expect(actual.length).to.be.greaterThan(0);
            expect(actual[0].name).to.equal("hans");
        });
    });
});
