import { FallbackWebSearchSercher } from "../../../ts/searcher/fallback-web-search-searcher";
import { WebSearch } from "../../../ts/web-search";
import { WebSearchBuilder } from "../../../ts/builders/web-search-builder";

describe(FallbackWebSearchSercher.name, (): void => {
    it("should not block other searchers", (): void => {
        const searcher = new FallbackWebSearchSercher([]);
        const actual = searcher.blockOthers;
        expect(actual).toBe(false);
    });

    it("should return a search result for earch fallback web searcher", (): void => {
        const webSearches: WebSearch[] = [
            {
                encodeSearchTerm: false,
                icon: "",
                isFallback: false,
                name: "non fallback",
                prefix: "n",
                priority: 1,
                url: "url",
            },
            {
                encodeSearchTerm: false,
                icon: "",
                isFallback: true,
                name: "fallback",
                prefix: "f",
                priority: 2,
                url: "url",
            },
        ];

        const userInput = "user-input";

        const searcher = new FallbackWebSearchSercher(webSearches);
        const actual = searcher.getSearchResult(userInput);

        expect(actual.length).toBe(1);
    });

    it("should sort the result by priority", () => {
        const webSearches = [
            { isFallback: true, name: "asdf", priority: 4 },
            { isFallback: true, name: "asdf", priority: 0 },
            { isFallback: true, name: "asdf", priority: 3 },
            { isFallback: true, name: "asdf", priority: 2 },
            { isFallback: true, name: "asdf", priority: 1 },
            { isFallback: true, name: "asdf", priority: 4 },
            { isFallback: true, name: "asdf", priority: 0 },
            { isFallback: true, name: "asdf", priority: -1 },
        ] as WebSearch[];

        const userInput = "asdf";

        const searcher = new FallbackWebSearchSercher(webSearches);
        const actual = searcher.getSearchResult(userInput);
        expect(actual.length).toBe(webSearches.length);

        const sortedWebSearches = webSearches.sort((a, b) => {
            if (a.priority < b.priority) {
                return 1;
            } else if (a.priority > b.priority) {
                return -1;
            }
            return 0;
        });

        for (let i = 0; i < actual.length; i++) {
            expect(actual[i].name).toBe(WebSearchBuilder.buildSearchResultItem(userInput, sortedWebSearches[i]).name);
        }
    });
});
