import { describe, expect, it } from "vitest";
import type { SearchResultItem } from "../SearchResultItem";
import { fuzzySortFilter } from "./fuzzySortFilter";

describe(fuzzySortFilter, () => {
    it("should return an empty list if search result items are empty", () => {
        const actual = fuzzySortFilter({
            searchResultItems: [],
            searchTerm: "search term",
            fuzziness: 0.5,
            maxSearchResultItems: 10,
        });

        expect(actual).toEqual([]);
    });

    it("should return an empty list if search term does not match any of the search result items", () => {
        const actual = fuzzySortFilter({
            searchResultItems: [<SearchResultItem>{ id: "item1", name: "Item 1", description: "Item 1" }],
            searchTerm: "search term",
            fuzziness: 0.5,
            maxSearchResultItems: 10,
        });

        expect(actual).toEqual([]);
    });

    it("should return list of one item if search term matches one search result item", () => {
        const actual = fuzzySortFilter({
            searchResultItems: <SearchResultItem[]>[
                { id: "item1", name: "Item 1", description: "Item 1" },
                { id: "item2", name: "Item 2", description: "Item 2" },
            ],
            searchTerm: "item 2",
            fuzziness: 0.5,
            maxSearchResultItems: 10,
        });

        expect(actual).toEqual([{ id: "item2", name: "Item 2", description: "Item 2" }]);
    });

    it("should return list of multiple items if search term matches multiple search result items", () => {
        const actual = fuzzySortFilter({
            searchResultItems: <SearchResultItem[]>[
                { id: "item1", name: "Item 1", description: "Item 1" },
                { id: "item2", name: "Item 2", description: "Item 2" },
            ],
            searchTerm: "item",
            fuzziness: 0.5,
            maxSearchResultItems: 10,
        });

        expect(actual).toEqual([
            { id: "item2", name: "Item 2", description: "Item 2" },
            { id: "item1", name: "Item 1", description: "Item 1" },
        ]);
    });

    // This test covers the use case described in this GitHub issue:
    // https://github.com/oliverschwendener/ueli/issues/978
    it("should not include Visual Studio Code in search result list when search term is 'zixuam g4uzipof gmde'", () => {
        const actual = fuzzySortFilter({
            searchResultItems: [
                <SearchResultItem>{
                    id: "item1",
                    name: "Visual Studio Code",
                    description: "Item 1",
                },
            ],
            searchTerm: "zixuam g4uzipof gmde",
            fuzziness: 0.5,
            maxSearchResultItems: 10,
        });

        expect(actual).toEqual([]);
    });
});
