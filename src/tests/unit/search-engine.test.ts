import { SearchResultItem } from "../../ts/search-result-item";
import { SearchEngine } from "./../../ts/search-engine";

function getFakeItems(items: string[]): SearchResultItem[] {
    return items.map((i): SearchResultItem => {
        return {
            executionArgument: i,
            name: i,
            tags: [i],
        } as SearchResultItem;
    });
}

describe("SearchEngine", (): void => {
    describe("search", (): void => {
        it("should return more than 0 search result items", (): void => {
            const fakeItems = getFakeItems(["abc", "abcd", "abcde"]);
            const searchEngine = new SearchEngine(fakeItems);
            const userInput = "abc";

            const actual = searchEngine.search(userInput);

            expect(actual.length).toBeGreaterThan(0);
        });

        it("should return empty array when user input doesnt match any of the plugin items", (): void => {
            const fakeItems = getFakeItems(["abc", "abcd", "abcde"]);
            const searchEngine = new SearchEngine(fakeItems);
            const userInput = "xyz";

            const actual = searchEngine.search(userInput);

            expect(actual.length).toBe(0);
        });

        it("should return the search result ordered by score", (): void => {
            const fakeItems = getFakeItems(["hans", "nhas", "hasn"]);
            const searchEngine = new SearchEngine(fakeItems);
            const userInput = "han";

            const actual = searchEngine.search(userInput);

            expect(actual.length).toBeGreaterThan(0);
            expect(actual[0].name).toBe("hans");
        });
    });
});
