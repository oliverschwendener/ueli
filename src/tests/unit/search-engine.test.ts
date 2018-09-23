import { SearchResultItem } from "../../ts/search-result-item";
import { SearchEngine } from "./../../ts/search-engine";
import { CountManager } from "../../ts/count/count-manager";
import { FakeCountRepository } from "./fake-count-repository";
import { Count } from "../../ts/count/count";

describe("SearchEngine", (): void => {
    const threshold = 4; // same as default config

    describe("search", (): void => {
        it("should return all items if user input matches all items", (): void => {
            const fakeItems = [
                { searchable: ["abc"] },
                { searchable: ["abcd"] },
                { searchable: ["abcde"] },
            ] as SearchResultItem[];

            const searchEngine = new SearchEngine(fakeItems, threshold);
            const userInput = "abc";

            const actual = searchEngine.search(userInput);

            expect(actual.length).toBeGreaterThan(0);
        });

        it("should find items with their tags", (): void => {
            const fakeItems = [
                { searchable: ["x"], tags: ["abc"] },
                { searchable: ["xy"], tags: ["abcd"] },
                { searchable: ["xyz"], tags: ["abcde"] },
            ] as SearchResultItem[];

            const searchEngine = new SearchEngine(fakeItems, threshold);
            const userInput = "abc";

            const actual = searchEngine.search(userInput);

            expect(actual.length).toBeGreaterThan(0);
        });

        it("should return empty array when user input doesnt match any of the plugin items", (): void => {
            const fakeItems = [
                { searchable: ["abc"] },
                { searchable: ["abcd"] },
                { searchable: ["abcde"] },
            ] as SearchResultItem[];

            const searchEngine = new SearchEngine(fakeItems, threshold);
            const userInput = "xyz";

            const actual = searchEngine.search(userInput);

            expect(actual.length).toBe(0);
        });

        it("should return the search result ordered by score", (): void => {
            const fakeItems = [
                { name: "1", searchable: ["hans"] },
                { name: "2", searchable: ["nhas"] },
                { name: "3", searchable: ["hasn"] },
            ] as SearchResultItem[];

            const searchEngine = new SearchEngine(fakeItems, threshold);
            const userInput = "han";

            const actual = searchEngine.search(userInput);

            expect(actual.length).toBeGreaterThan(0);
            expect(actual[0].name).toBe("1");
        });

        it("should list frequently used items higher", (): void => {
            const fakeCount: Count = {
                abc: 5,
                abcd: 6,
                abcde: 7,
            };
            const fakeCountRepo = new FakeCountRepository(fakeCount);
            const countManager = new CountManager(fakeCountRepo);

            const fakeItems = [
                { name: "1", searchable: ["abc"] },
                { name: "2", searchable: ["abcd"] },
                { name: "3", searchable: ["abcde"] },
            ] as SearchResultItem[];

            const searchEngine = new SearchEngine(fakeItems, threshold);
            const userInput = "ab";

            const result = searchEngine.search(userInput, countManager);

            expect(result.length).toBe(3);
            expect(result[0].name).toBe("1");
            expect(result[1].name).toBe("2");
            expect(result[2].name).toBe("3");
        });

        it("should not list frequently used items higher if their count is 4 or lower", (): void => {
            const fakeCount: Count = {
                abc: 1,
                abcd: 2,
                abcde: 3,
            };
            const fakeCountRepo = new FakeCountRepository(fakeCount);
            const countManager = new CountManager(fakeCountRepo);

            const fakeItems = [
                { name: "1", searchable: ["abc"], executionArgument: "abc" },
                { name: "2", searchable: ["abcd"], executionArgument: "abcd" },
                { name: "3", searchable: ["abcde"], executionArgument: "abcde" },
            ] as SearchResultItem[];

            const searchEngine = new SearchEngine(fakeItems, threshold);
            const userInput = "a";

            const result = searchEngine.search(userInput, countManager);

            expect(result.length).toBe(3);
            expect(result[0].name).toBe("1");
            expect(result[1].name).toBe("2");
            expect(result[2].name).toBe("3");
        });

        it("should list frequently used items higher if their count is higher than 4", (): void => {
            const fakeCount: Count = {
                thisisjustrandomtext: 1,
                // tslint:disable-next-line:object-literal-sort-keys for better readability
                thisisjustanotherrandomtext: 2,
                thisisjustanotherrandomweirdtext: 20,
            };

            const fakeCountRepo = new FakeCountRepository(fakeCount);
            const countManager = new CountManager(fakeCountRepo);

            const fakeItems = [
                { name: "1", searchable: ["thisisjustrandomtext"], executionArgument: "thisisjustrandomtext" },
                { name: "2", searchable: ["thisisjustanotherrandomtext"], executionArgument: "thisisjustanotherrandomtext" },
                { name: "3", searchable: ["thisisjustanotherrandomweirdtext"], executionArgument: "thisisjustanotherrandomweirdtext" },
            ] as SearchResultItem[];

            const searchEngine = new SearchEngine(fakeItems, threshold);
            const userInput = "Th";

            const result = searchEngine.search(userInput, countManager);

            expect(result.length).toBe(3);
            expect(result[0].name).toBe("3");
            expect(result[1].name).toBe("1");
            expect(result[2].name).toBe("2");
        });
    });
});
