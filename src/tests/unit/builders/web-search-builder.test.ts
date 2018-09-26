import { WebSearchBuilder } from "../../../ts/builders/web-search-builder";
import { WebSearch } from "../../../ts/web-search";
import { WebSearchHelpers } from "../../../ts/helpers/web-search-helper";

describe(WebSearchBuilder.name, (): void => {
    describe(WebSearchBuilder.buildExecutionUrl.name, (): void => {
        it("should build the execution url correctly", (): void => {
            const userInput = "something";
            const webSearchUrl = "https://my-web-search-engine.com/search?q=";
            const webSearch = { url: webSearchUrl } as WebSearch;

            const actual = WebSearchBuilder.buildExecutionUrl(userInput, webSearch);

            expect(actual).toBe(`${webSearchUrl}${userInput}`);
        });
    });

    describe(WebSearchBuilder.buildSearchResultItem.name, (): void => {
        it("should build the search result item correctly if userinput is not an empty string", (): void => {
            const userInput = "something";
            const webSearch = {
                icon: "<svg>...</svg>",
                name: "My search engine",
                prefix: "m",
                url: "https://my-search-engine.com/search?q=",
            } as WebSearch;

            const actual = WebSearchBuilder.buildSearchResultItem(userInput, webSearch);

            expect(actual.executionArgument).toBe(WebSearchBuilder.buildExecutionUrl(userInput, webSearch));
            expect(actual.icon).toBe(webSearch.icon);
            expect(actual.name).toBe(`Search ${webSearch.name} for '${userInput}'`);
        });

        it("should build the search result item correctly if userinput is an empty string", (): void => {
            const userInput = "";

            const webSearch = {
                icon: "<svg>...</svg>",
                name: "My search engine",
                prefix: "m",
                url: "https://my-search-engine.com/search?q=",
            } as WebSearch;

            const actual = WebSearchBuilder.buildSearchResultItem(userInput, webSearch);

            expect(actual.executionArgument).toBe(WebSearchBuilder.buildExecutionUrl(userInput, webSearch));
            expect(actual.icon).toBe(webSearch.icon);
            expect(actual.name).toBe(`Search ${webSearch.name}`);
        });
    });

    describe(WebSearchBuilder.buildSearchTerm.name, (): void => {
        it("should build the search term correctly", (): void => {
            const prefix = "m";
            const searchTerm = "something";
            const userInput = `${prefix}${WebSearchHelpers.webSearchSeparator}${searchTerm}`;
            const webSearch = { prefix } as WebSearch;

            const actual = WebSearchBuilder.buildSearchTerm(userInput, webSearch);

            expect(actual).toBe(searchTerm);
        });
    });
});
