import { WebSearchBuilder } from "../../../ts/builders/web-search-builder";
import { WebSearch } from "../../../ts/web-search";
import { WebSearchHelpers } from "../../../ts/helpers/web-search-helper";
import { UeliHelpers } from "../../../ts/helpers/ueli-helpers";

describe(WebSearchBuilder.name, () => {
    describe(WebSearchBuilder.buildExecutionUrl.name, () => {
        it("should build the execution url correctly", () => {
            const webSearch = { url: "https://my-web-search-engine.com/search?q=" } as WebSearch;
            const searchTerm = "something";
            const actual = WebSearchBuilder.buildExecutionUrl(searchTerm, webSearch);
            expect(actual).toBe(`${webSearch.url}${searchTerm}`);
        });

        it("should trim the search term", () => {
            const webSearch = {
                url: `https://my-web-search-engine.com/search?q=${UeliHelpers.websearchQueryPlaceholder}&suffix=foo`,
                whitespaceCharacter: "+",
            } as WebSearch;
            const searchTerm = " something";
            const expected = `${webSearch.url.replace(UeliHelpers.websearchQueryPlaceholder, searchTerm.trim())}`;
            const actual = WebSearchBuilder.buildExecutionUrl(searchTerm, webSearch);
            expect(actual).toBe(expected);
        });

        it("should replace the query placeholder with the search term if it is set", () => {
            const userInput = "something";
            const webSearchUrl = `https://my-web-search-engine.com/?query=${UeliHelpers.websearchQueryPlaceholder}&suffix=asdf`;
            const webSearch = { url: webSearchUrl } as WebSearch;

            const actual = WebSearchBuilder.buildExecutionUrl(userInput, webSearch);

            expect(actual).toBe(webSearchUrl.replace(UeliHelpers.websearchQueryPlaceholder, userInput));
        });

        it("should replace all whitespace by specified whitespace string if it is set", () => {
            const userInput = "this contains whitespace";
            const webSearchUrl = "https://my-search-engine.com/?query=";
            const whitespaceCharacter = "+";
            const webSearch = { url: webSearchUrl, whitespaceCharacter } as WebSearch;
            const expected = `${webSearchUrl}this+contains+whitespace`;
            const actual = WebSearchBuilder.buildExecutionUrl(userInput, webSearch);
            expect(actual).toBe(expected);
        });

        it("should encode the search term if encodeSearchTerm is set to true", () => {
            const searchTerm = "c#";
            const webSearch = {
                encodeSearchTerm: true,
                prefix: "g",
                url: "https://google.com/q=",
            } as WebSearch;
            const expected = `${webSearch.url}${encodeURIComponent(searchTerm)}`;
            const actual = WebSearchBuilder.buildExecutionUrl(searchTerm, webSearch);
            expect(actual).toBe(expected);
        });

        it("should not encode the search term if encodeSearchTerm is set to false", () => {
            const searchTerm = "c#";
            const webSearch = {
                encodeSearchTerm: false,
                prefix: "g",
                url: "https://google.com/q=",
            } as WebSearch;
            const expected = `${webSearch.url}${searchTerm}`;
            const actual = WebSearchBuilder.buildExecutionUrl(searchTerm, webSearch);
            expect(actual).toBe(expected);
        });
    });

    describe(WebSearchBuilder.buildSearchResultItem.name, () => {
        it("should build the search result item correctly if userinput is not an empty string", () => {
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

        it("should build the search result item correctly if userinput is an empty string", () => {
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

    describe(WebSearchBuilder.buildSearchTerm.name, () => {
        it("should build the search term correctly", () => {
            const prefix = "m";
            const searchTerm = "something";
            const userInput = `${prefix}${WebSearchHelpers.webSearchSeparator}${searchTerm}`;
            const webSearch = { prefix } as WebSearch;

            const actual = WebSearchBuilder.buildSearchTerm(userInput, webSearch);

            expect(actual).toBe(searchTerm);
        });
    });
});
