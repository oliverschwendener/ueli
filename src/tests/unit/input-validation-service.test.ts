import { InputValidationService } from "../../ts/input-validation-service";
import { InputValidatorSearcherCombination } from "../../ts/input-validator-searcher-combination";
import { FakeSearcher } from "./fake-searcher";
import { FakeInputValidator } from "./fake-input-validator";
import { SearchResultItem } from "../../ts/search-result-item";

describe(InputValidationService.name, (): void => {
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

            const inputValidationService = new InputValidationService(combinations);

            for (const userInput of userInputs) {
                const actual = inputValidationService.getSearchResult(userInput as string);
                expect(actual.length).toBe(0);
            }
        });

        it("should return an empty array when combinations are an empty array", () => {
            const inputValidationService = new InputValidationService([]);
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

            const inputValidationService = new InputValidationService(combinations);

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
            const inputValidationService = new InputValidationService(combinations);

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

            const inputValidationService = new InputValidationService(combinations);

            const actual = inputValidationService.getSearchResult("something");

            expect(actual.length).toBe(1);
            expect(actual[0].name).toBe("Search Result 2");
        });
    });
});
