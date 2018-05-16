import { SearchResultItem } from "../../ts/search-result-item";
import { SearchEngine } from "./../../ts/search-engine";
import { CountManager } from "../../ts/count-manager";
import {FakeCountRepository} from "./fake-count-repository";
import { Count } from "../../ts/count";
import { defaultConfig } from "../../ts/default-config";

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
            const searchEngine = new SearchEngine(fakeItems, defaultConfig);
            const userInput = "abc";

            const actual = searchEngine.search(userInput);

            expect(actual.length).toBeGreaterThan(0);
        });

        it("should return empty array when user input doesnt match any of the plugin items", (): void => {
            const fakeItems = getFakeItems(["abc", "abcd", "abcde"]);
            const searchEngine = new SearchEngine(fakeItems, defaultConfig);
            const userInput = "xyz";

            const actual = searchEngine.search(userInput);

            expect(actual.length).toBe(0);
        });

        it("should return the search result ordered by score", (): void => {
            const fakeItems = getFakeItems(["hans", "nhas", "hasn"]);
            const searchEngine = new SearchEngine(fakeItems, defaultConfig);
            const userInput = "han";

            const actual = searchEngine.search(userInput);

            expect(actual.length).toBeGreaterThan(0);
            expect(actual[0].name).toBe("hans");
        });

        it("should list frequently used items higher", (): void => {
            const fakeCount: Count = {
                abc: 5,
                abcd: 6,
                abcde: 7,
            };
            const fakeCountRepo = new FakeCountRepository(fakeCount);
            const countManager = new CountManager(fakeCountRepo);
            const fakeItems = getFakeItems(["abc", "abcd", "abcde"]);
            const searchEngine = new SearchEngine(fakeItems, defaultConfig);
            const userInput = "ab";

            const result = searchEngine.search(userInput, countManager);

            expect(result.length).toBe(3);
            expect(result[0].name).toBe("abcde");
            expect(result[1].name).toBe("abcd");
            expect(result[2].name).toBe("abc");
        });

        it("should not list frequently used items higher if their count is 4 or lower", (): void => {
            const fakeCount: Count = {
                abc: 1,
                abcd: 2,
                abcde: 3,
            };
            const fakeCountRepo = new FakeCountRepository(fakeCount);
            const countManager = new CountManager(fakeCountRepo);
            const fakeItems = getFakeItems(["abc", "abcd", "abcde"]);
            const searchEngine = new SearchEngine(fakeItems, defaultConfig);
            const userInput = "ab";

            const result = searchEngine.search(userInput, countManager);

            expect(result.length).toBe(3);
            expect(result[0].name).toBe("abc");
            expect(result[1].name).toBe("abcd");
            expect(result[2].name).toBe("abcde");
        });
    });
});
