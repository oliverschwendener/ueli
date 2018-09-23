import { InputValidationService } from "../../ts/input-validation-service";
import { FakeSearcher } from "./fake-searcher";
import { FakeInputValidator } from "./fake-input-validator";
import { SearchResultItem } from "../../ts/search-result-item";
import { ConfigOptions } from "../../ts/config-options";
import { WebSearch } from "../../ts/web-search";
import { WebSearchBuilder } from "../../ts/builders/web-search-builder";

describe(InputValidationService.name, (): void => {
    const config = {
        fallbackWebSearches: [] as string[],
    } as ConfigOptions;

    describe("getSearchResults", () => {
        it("should return an empty array if user input is an empty string, undefined or null", (): void => {

            const userInputs = [
                "",
                "     ",
                undefined,
                null,
            ];

            const combinations = [
                {
                    searcher: new FakeSearcher([{ name: "Search Result 1" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(true),
                },
                {
                    searcher: new FakeSearcher([{ name: "Search Result 2" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
                {
                    searcher: new FakeSearcher([{ name: "Search Result 3" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
            ];

            const inputValidationService = new InputValidationService(config, combinations);

            for (const userInput of userInputs) {
                const actual = inputValidationService.getSearchResult(userInput as string);
                expect(actual.length).toBe(0);
            }
        });

        it("should return an empty array when combinations are an empty array", () => {
            const inputValidationService = new InputValidationService(config, []);
            const actual = inputValidationService.getSearchResult("anything");
            expect(actual.length).toBe(0);
        });

        it("should return an empty array if user input matches none of the searchers", (): void => {
            const combinations = [
                {
                    searcher: new FakeSearcher([{ name: "Search Result 1" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
                {
                    searcher: new FakeSearcher([{ name: "Search Result 2" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
                {
                    searcher: new FakeSearcher([{ name: "Search Result 3" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
            ];

            const inputValidationService = new InputValidationService(config, combinations);

            const actual = inputValidationService.getSearchResult("something");

            expect(actual.length).toBe(0);
        });

        it("should return all items if user input matches all searchers", (): void => {
            const combinations = [
                {
                    searcher: new FakeSearcher([{ name: "Search Result 1" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(true),
                },
                {
                    searcher: new FakeSearcher([{ name: "Search Result 2" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(true),
                },
                {
                    searcher: new FakeSearcher([{ name: "Search Result 3" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(true),
                },
            ];
            const inputValidationService = new InputValidationService(config, combinations);

            const actual = inputValidationService.getSearchResult("something");

            expect(actual.length).toBe(3);
        });

        it("should return only the items that match the user input", (): void => {
            const combinations = [
                {
                    searcher: new FakeSearcher([{ name: "Search Result 1" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
                {
                    searcher: new FakeSearcher([{ name: "Search Result 2" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(true),
                },
                {
                    searcher: new FakeSearcher([{ name: "Search Result 3" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
            ];

            const inputValidationService = new InputValidationService(config, combinations);

            const actual = inputValidationService.getSearchResult("something");

            expect(actual.length).toBe(1);
            expect(actual[0].name).toBe("Search Result 2");
        });

        it("should return empty search result if no fallback search results are defined and user input does not match any searcher", (): void => {
            const combinations = [
                {
                    searcher: new FakeSearcher([{ name: "Search Result 1" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
                {
                    searcher: new FakeSearcher([{ name: "Search Result 2" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
                {
                    searcher: new FakeSearcher([{ name: "Search Result 3" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
            ];

            const inputValidationService = new InputValidationService(config, combinations);

            const actual = inputValidationService.getSearchResult("something");

            expect(actual.length).toBe(0);
        });

        it("should return an emtpy array if defined fallback web search does not match any web searches", (): void => {
            const fallBackWebSearchName = "DuckDuckGo";
            const webSearchName = "Google";
            const fallBackWebSearchUrl = "https://google.com/search?q=";
            const userInput = "something";
            const webSearch = {
                name: webSearchName,
                url: fallBackWebSearchUrl,
            } as WebSearch;

            config.fallbackWebSearches = [fallBackWebSearchName];
            config.webSearches = [webSearch];

            const combinations = [
                {
                    searcher: new FakeSearcher([{ name: "Search Result 1" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
                {
                    searcher: new FakeSearcher([{ name: "Search Result 2" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
                {
                    searcher: new FakeSearcher([{ name: "Search Result 3" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
            ];

            const inputValidationService = new InputValidationService(config, combinations);

            const actual = inputValidationService.getSearchResult(userInput);

            expect(actual.length).toBe(0);
        });

        it("should return a search result for each fallback search result if user input does not match any searcher", (): void => {
            const fallBackWebSearchName = "Google";
            const fallBackWebSearchUrl = "https://google.com/search?q=";
            const userInput = "something";
            const webSearch = {
                name: fallBackWebSearchName,
                url: fallBackWebSearchUrl,
            } as WebSearch;

            config.fallbackWebSearches = [fallBackWebSearchName];
            config.webSearches = [webSearch];

            const combinations = [
                {
                    searcher: new FakeSearcher([{ name: "Search Result 1" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
                {
                    searcher: new FakeSearcher([{ name: "Search Result 2" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
                {
                    searcher: new FakeSearcher([{ name: "Search Result 3" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
            ];

            const inputValidationService = new InputValidationService(config, combinations);

            const actual = inputValidationService.getSearchResult(userInput);

            expect(actual.length).toBe(1);
            expect(actual[0].name).toBe(WebSearchBuilder.buildSearchResultItem(userInput, webSearch).name);
            expect(actual[0].executionArgument).toBe(`${fallBackWebSearchUrl}${userInput}`);
        });
    });
});
