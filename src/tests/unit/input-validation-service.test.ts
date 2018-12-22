import { InputValidationService } from "../../ts/input-validation-service";
import { FakeSearcher } from "./fake-searcher";
import { FakeInputValidator } from "./fake-input-validator";
import { SearchResultItem } from "../../ts/search-result-item";
import { UserConfigOptions } from "../../ts/user-config/user-config-options";
import { WebSearch } from "../../ts/web-search";
import { WebSearchBuilder } from "../../ts/builders/web-search-builder";
import { InputValidatorSearcherCombination } from "../../ts/input-validator-searcher-combination";

describe(InputValidationService.name, (): void => {
    const config = {
        webSearches: [] as WebSearch[],
    } as UserConfigOptions;

    describe("getSearchResults", () => {
        it("should return an empty array if user input is an empty string, undefined or null", (): void => {

            const userInputs = [
                "",
                "     ",
                undefined,
                null,
            ];

            const shouldBlockOtherSearchers = false;

            const combinations: InputValidatorSearcherCombination[] = [
                {
                    searcher: new FakeSearcher(shouldBlockOtherSearchers, [{ name: "Search Result 1" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(true),
                },
                {
                    searcher: new FakeSearcher(shouldBlockOtherSearchers, [{ name: "Search Result 2" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
                {
                    searcher: new FakeSearcher(shouldBlockOtherSearchers, [{ name: "Search Result 3" }] as SearchResultItem[]),
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
            const shouldBlockOtherSearchers = false;
            const combinations: InputValidatorSearcherCombination[] = [
                {
                    searcher: new FakeSearcher(shouldBlockOtherSearchers, [{ name: "Search Result 1" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
                {
                    searcher: new FakeSearcher(shouldBlockOtherSearchers, [{ name: "Search Result 2" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
                {
                    searcher: new FakeSearcher(shouldBlockOtherSearchers, [{ name: "Search Result 3" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
            ];

            const inputValidationService = new InputValidationService(config, combinations);

            const actual = inputValidationService.getSearchResult("something");

            expect(actual.length).toBe(0);
        });

        it("should return all items if user input matches all searchers", (): void => {
            const shouldBlockOtherSearchers = false;
            const combinations: InputValidatorSearcherCombination[] = [
                {
                    searcher: new FakeSearcher(shouldBlockOtherSearchers, [{ name: "Search Result 1" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(true),
                },
                {
                    searcher: new FakeSearcher(shouldBlockOtherSearchers, [{ name: "Search Result 2" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(true),
                },
                {
                    searcher: new FakeSearcher(shouldBlockOtherSearchers, [{ name: "Search Result 3" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(true),
                },
            ];
            const inputValidationService = new InputValidationService(config, combinations);

            const actual = inputValidationService.getSearchResult("something");

            expect(actual.length).toBe(3);
        });

        it("should return only the items that match the user input", (): void => {
            const shouldBlockOtherSearchers = false;
            const combinations: InputValidatorSearcherCombination[] = [
                {
                    searcher: new FakeSearcher(shouldBlockOtherSearchers, [{ name: "Search Result 1" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
                {
                    searcher: new FakeSearcher(shouldBlockOtherSearchers, [{ name: "Search Result 2" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(true),
                },
                {
                    searcher: new FakeSearcher(shouldBlockOtherSearchers, [{ name: "Search Result 3" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
            ];

            const inputValidationService = new InputValidationService(config, combinations);

            const actual = inputValidationService.getSearchResult("something");

            expect(actual.length).toBe(1);
            expect(actual[0].name).toBe("Search Result 2");
        });

        it("should return empty search result if no fallback search results are defined and user input does not match any searcher", (): void => {
            const shouldBlockOtherSearchers = false;
            const combinations: InputValidatorSearcherCombination[] = [
                {
                    searcher: new FakeSearcher(shouldBlockOtherSearchers, [{ name: "Search Result 1" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
                {
                    searcher: new FakeSearcher(shouldBlockOtherSearchers, [{ name: "Search Result 2" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
                {
                    searcher: new FakeSearcher(shouldBlockOtherSearchers, [{ name: "Search Result 3" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
            ];

            const inputValidationService = new InputValidationService(config, combinations);

            const actual = inputValidationService.getSearchResult("something");

            expect(actual.length).toBe(0);
        });

        it("should return a search result for each fallback search result if user input does not match any searcher", (): void => {
            const fallBackWebSearchName = "Google";
            const fallBackWebSearchUrl = "https://google.com/search?q=";
            const userInput = "something";
            const webSearch = {
                isFallback: true,
                name: fallBackWebSearchName,
                url: fallBackWebSearchUrl,
            } as WebSearch;

            config.webSearches = [webSearch];

            const shouldBlockOtherSearchers = false;
            const combinations: InputValidatorSearcherCombination[] = [
                {
                    searcher: new FakeSearcher(shouldBlockOtherSearchers, [{ name: "Search Result 1" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
                {
                    searcher: new FakeSearcher(shouldBlockOtherSearchers, [{ name: "Search Result 2" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
                {
                    searcher: new FakeSearcher(shouldBlockOtherSearchers, [{ name: "Search Result 3" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(false),
                },
            ];

            const inputValidationService = new InputValidationService(config, combinations);

            const actual = inputValidationService.getSearchResult(userInput);

            expect(actual.length).toBe(1);
            expect(actual[0].name).toBe(WebSearchBuilder.buildSearchResultItem(userInput, webSearch).name);
            expect(actual[0].executionArgument).toBe(`${fallBackWebSearchUrl}${userInput}`);
        });

        it("should only return search results from first blocking searcher", (): void => {
            const combinations: InputValidatorSearcherCombination[] = [
                {
                    searcher: new FakeSearcher(false, [{ name: "Search Result 1" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(true),
                },
                {
                    searcher: new FakeSearcher(false, [{ name: "Search Result 2" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(true),
                },
                {
                    searcher: new FakeSearcher(true, [{ name: "Search Result 3" }] as SearchResultItem[]),
                    validator: new FakeInputValidator(true),
                },
            ];

            const userInput = "search";

            const searchResults = new InputValidationService(config, combinations).getSearchResult(userInput);

            expect(searchResults.length).toBe(1);
            expect(searchResults[0].name).toBe("Search Result 3");
        });

        it("should slice the search results correctly", (): void => {
            const limit = 3;
            const newConfig = { searchEngineLimit: limit } as UserConfigOptions;
            const userInput = "abc";

            const combinations: InputValidatorSearcherCombination[] = [
                {
                    searcher: new FakeSearcher(true, [
                        { name: "a" },
                        { name: "b" },
                        { name: "c" },
                        { name: "d" },
                        { name: "e" },
                    ] as SearchResultItem[]),
                    validator: new FakeInputValidator(true),
                },
            ];

            const actual = new InputValidationService(newConfig, combinations).getSearchResult(userInput);
            expect(actual.length).toBe(limit);
        });
    });
});
