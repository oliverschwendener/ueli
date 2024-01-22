import type { ExcludedSearchResultItem, SearchResultItem } from "@common/Core";
import { describe, expect, it } from "vitest";
import { filterSearchResultItemsBySearchTerm } from "./filterSearchResultItemsBySearchTerm";

const testFilterSearchResultItemsBySearchTerm = ({
    searchResultItems,
    excludedSearchResultItems,
    searchTerm,
    fuzziness,
    expected,
}: {
    expected: SearchResultItem[];
    searchResultItems: SearchResultItem[];
    excludedSearchResultItems: ExcludedSearchResultItem[];
    fuzziness: number;
    searchTerm: string;
}) =>
    expect(
        filterSearchResultItemsBySearchTerm({
            searchResultItems,
            excludedSearchResultItems,
            searchOptions: {
                searchTerm,
                fuzziness,
            },
        }),
    ).toEqual(expected);

describe(filterSearchResultItemsBySearchTerm, () => {
    it("should return an empty list if search result items are empty", () =>
        testFilterSearchResultItemsBySearchTerm({
            searchResultItems: [],
            excludedSearchResultItems: [],
            searchTerm: "search term",
            fuzziness: 0.6,
            expected: [],
        }));

    it("should return an empty list if search term does not match any of the search result items", () =>
        testFilterSearchResultItemsBySearchTerm({
            searchResultItems: [<SearchResultItem>{ id: "item1", name: "Item 1", description: "Item 1" }],
            excludedSearchResultItems: [],
            searchTerm: "search term",
            fuzziness: 0.6,
            expected: [],
        }));

    it("should return list of one item if search term matches one search result item", () =>
        testFilterSearchResultItemsBySearchTerm({
            searchResultItems: [
                <SearchResultItem>{ id: "item1", name: "Old Man's War", description: "An old book" },
                <SearchResultItem>{ id: "item2", name: "The Lock Artist", description: "A very old book" },
            ],
            excludedSearchResultItems: [],
            searchTerm: "Old",
            fuzziness: 0.6,
            expected: [<SearchResultItem>{ id: "item1", name: "Old Man's War", description: "An old book" }],
        }));

    it("should be case insensitive", () =>
        testFilterSearchResultItemsBySearchTerm({
            searchResultItems: [<SearchResultItem>{ id: "item1", name: "Item 1", description: "Item 1" }],
            excludedSearchResultItems: [],
            searchTerm: "item",
            fuzziness: 0.6,
            expected: [<SearchResultItem>{ id: "item1", name: "Item 1", description: "Item 1" }],
        }));

    it("should include items that partially match the search term if fuzziness is high", () =>
        testFilterSearchResultItemsBySearchTerm({
            searchResultItems: [<SearchResultItem>{ id: "item1", name: "Item 1", description: "Item 1" }],
            excludedSearchResultItems: [],
            searchTerm: "itm",
            fuzziness: 0.6,
            expected: [<SearchResultItem>{ id: "item1", name: "Item 1", description: "Item 1" }],
        }));

    it("should exclude items that partially match the search term if fuzziness is low", () =>
        testFilterSearchResultItemsBySearchTerm({
            searchResultItems: [<SearchResultItem>{ id: "item1", name: "Item 1", description: "Item 1" }],
            excludedSearchResultItems: [],
            searchTerm: "itm",
            fuzziness: 0.2,
            expected: [],
        }));

    it("should exclude the excluded search result items", () =>
        testFilterSearchResultItemsBySearchTerm({
            searchResultItems: [
                <SearchResultItem>{ id: "item1", name: "Item 1", description: "Item 1" },
                <SearchResultItem>{ id: "item2", name: "Item 2", description: "Item 2" },
            ],
            excludedSearchResultItems: [{ id: "item1", name: "Some name" }],
            expected: [<SearchResultItem>{ id: "item2", name: "Item 2", description: "Item 2" }],
            fuzziness: 0.6,
            searchTerm: "item",
        }));
});
