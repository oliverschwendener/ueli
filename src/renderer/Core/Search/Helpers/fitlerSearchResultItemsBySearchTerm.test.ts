import type { SearchResultItem } from "@common/Core";
import { describe, expect, it } from "vitest";
import { filterSearchResultItemsBySearchTerm } from "./filterSearchResultItemsBySearchTerm";

const testFilterSearchResultItemsBySearchTerm = ({
    searchResultItems,
    excludedIds,
    searchTerm,
    fuzziness,
    maxResultLength,
    expected,
}: {
    expected: SearchResultItem[];
    searchResultItems: SearchResultItem[];
    excludedIds: string[];
    fuzziness: number;
    maxResultLength: number;
    searchTerm: string;
}) =>
    expect(
        filterSearchResultItemsBySearchTerm({
            searchResultItems,
            excludedIds,
            searchOptions: { searchTerm, fuzziness, maxResultLength },
        }),
    ).toEqual(expected);

describe(filterSearchResultItemsBySearchTerm, () => {
    it("should return an empty list if search result items are empty", () =>
        testFilterSearchResultItemsBySearchTerm({
            searchResultItems: [],
            excludedIds: [],
            searchTerm: "search term",
            fuzziness: 0.6,
            maxResultLength: 10,
            expected: [],
        }));

    it("should return an empty list if search term does not match any of the search result items", () =>
        testFilterSearchResultItemsBySearchTerm({
            searchResultItems: [<SearchResultItem>{ id: "item1", name: "Item 1", description: "Item 1" }],
            excludedIds: [],
            searchTerm: "search term",
            fuzziness: 0.6,
            maxResultLength: 10,
            expected: [],
        }));

    it("should return list of one item if search term matches one search result item", () =>
        testFilterSearchResultItemsBySearchTerm({
            searchResultItems: [
                <SearchResultItem>{ id: "item1", name: "Old Man's War", description: "An old book" },
                <SearchResultItem>{ id: "item2", name: "The Lock Artist", description: "A very old book" },
            ],
            excludedIds: [],
            searchTerm: "Old",
            fuzziness: 0.6,
            maxResultLength: 10,
            expected: [<SearchResultItem>{ id: "item1", name: "Old Man's War", description: "An old book" }],
        }));

    it("should be case insensitive", () =>
        testFilterSearchResultItemsBySearchTerm({
            searchResultItems: [<SearchResultItem>{ id: "item1", name: "Item 1", description: "Item 1" }],
            excludedIds: [],
            searchTerm: "item",
            fuzziness: 0.6,
            maxResultLength: 10,
            expected: [<SearchResultItem>{ id: "item1", name: "Item 1", description: "Item 1" }],
        }));

    it("should include items that partially match the search term if fuzziness is high", () =>
        testFilterSearchResultItemsBySearchTerm({
            searchResultItems: [<SearchResultItem>{ id: "item1", name: "Item 1", description: "Item 1" }],
            excludedIds: [],
            searchTerm: "itm",
            fuzziness: 0.6,
            maxResultLength: 10,
            expected: [<SearchResultItem>{ id: "item1", name: "Item 1", description: "Item 1" }],
        }));

    it("should exclude items that partially match the search term if fuzziness is low", () =>
        testFilterSearchResultItemsBySearchTerm({
            searchResultItems: [<SearchResultItem>{ id: "item1", name: "Item 1", description: "Item 1" }],
            excludedIds: [],
            searchTerm: "itm",
            fuzziness: 0.2,
            maxResultLength: 10,
            expected: [],
        }));

    it("should exclude the excluded search result items", () =>
        testFilterSearchResultItemsBySearchTerm({
            searchResultItems: [
                <SearchResultItem>{ id: "item1", name: "Item 1", description: "Item 1" },
                <SearchResultItem>{ id: "item2", name: "Item 2", description: "Item 2" },
            ],
            excludedIds: ["item1"],
            expected: [<SearchResultItem>{ id: "item2", name: "Item 2", description: "Item 2" }],
            fuzziness: 0.6,
            maxResultLength: 10,
            searchTerm: "item",
        }));

    it("should limit the search result items", () =>
        testFilterSearchResultItemsBySearchTerm({
            searchResultItems: [
                <SearchResultItem>{ id: "item1", name: "Item 1", description: "Item 1" },
                <SearchResultItem>{ id: "item2", name: "Item 2", description: "Item 2" },
            ],
            excludedIds: [],
            expected: [<SearchResultItem>{ id: "item1", name: "Item 1", description: "Item 1" }],
            fuzziness: 0.6,
            maxResultLength: 1,
            searchTerm: "item",
        }));

    it("should trim the given search term", () =>
        testFilterSearchResultItemsBySearchTerm({
            searchResultItems: [
                <SearchResultItem>{ id: "item1", name: "Item 1", description: "Item 1" },
                <SearchResultItem>{ id: "item2", name: " Item 1 ", description: "Item 2" },
            ],
            excludedIds: [],
            expected: [<SearchResultItem>{ id: "item1", name: "Item 1", description: "Item 1" }],
            fuzziness: 0.3,
            maxResultLength: 1,
            searchTerm: " item1 ",
        }));
});
