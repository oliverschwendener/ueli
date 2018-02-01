import { expect } from "chai";
import { SearchEngine, SearchResultItem } from "./../../src/ts/search-engine";
import { FakePlugin } from "./../../src/ts/plugins/fake-plugin";

function getFakeItems(items: string[]): SearchResultItem[] {
    return items.map((i) => {
        return <SearchResultItem>{
            name: i,
            executionArgument: i,
            tags: [i]
        }
    })
}

describe("Search engine", () => {
    describe("search", () => {
        it("should return more than 0 search result items", () => {
            let fakeItems = getFakeItems(["abc", "abcd", "abcde"]);
            let fakePlugins = [new FakePlugin(fakeItems)];
            let searchEngine = new SearchEngine(fakePlugins);
            let userInput = "abc";

            let actual = searchEngine.search(userInput);

            expect(actual.length).to.be.greaterThan(0);
        });

        it("should return empty array when user input doesnt match any of the plugin items", () => {
            let fakeItems = getFakeItems(["abc", "abcd", "abcde"]);
            let fakePlugins = [new FakePlugin(fakeItems)];
            let searchEngine = new SearchEngine(fakePlugins);
            let userInput = "xyz";

            let actual = searchEngine.search(userInput);

            expect(actual.length).to.eql(0);
        });

        it("should return the search result ordered by score", () => {
            let fakeItems = getFakeItems(["hans", "nhas", "hasn"]);
            let fakePlugins = [new FakePlugin(fakeItems)];
            let searchEngine = new SearchEngine(fakePlugins);
            let userInput = "han";

            let actual = searchEngine.search(userInput);

            expect(actual.length).to.be.greaterThan(0);
            expect(actual[0].name).to.equal("hans");
        });        
    });
});
