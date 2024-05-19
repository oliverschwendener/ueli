import type { SearchResultItem } from "@common/Core";
import { describe, expect, it } from "vitest";
import { fuseJsSearchFilter } from "./fuseJsSearchFilter";

const testFilterSearchResultItems = ({
    searchResultItems,
    searchTerm,
    fuzziness,
    maxSearchResultItems,
    expected,
}: {
    expected: SearchResultItem[];
    searchResultItems: SearchResultItem[];
    fuzziness: number;
    maxSearchResultItems: number;
    searchTerm: string;
}) => {
    const actual = fuseJsSearchFilter({
        searchResultItems,
        searchTerm,
        fuzziness,
        maxSearchResultItems,
    });

    expect(actual).toEqual(expected);
};

describe(fuseJsSearchFilter, () => {
    it("should return an empty list if search result items are empty", () =>
        testFilterSearchResultItems({
            searchResultItems: [],
            searchTerm: "search term",
            fuzziness: 0.6,
            maxSearchResultItems: 10,
            expected: [],
        }));

    it("should return an empty list if search term does not match any of the search result items", () =>
        testFilterSearchResultItems({
            searchResultItems: [<SearchResultItem>{ id: "item1", name: "Item 1", description: "Item 1" }],
            searchTerm: "search term",
            fuzziness: 0.6,
            maxSearchResultItems: 10,
            expected: [],
        }));

    it("should return list of one item if search term matches one search result item", () =>
        testFilterSearchResultItems({
            searchResultItems: [
                <SearchResultItem>{ id: "item1", name: "Old Man's War", description: "An old book" },
                <SearchResultItem>{ id: "item2", name: "The Lock Artist", description: "A very old book" },
            ],
            searchTerm: "Old",
            fuzziness: 0.6,
            maxSearchResultItems: 10,
            expected: [<SearchResultItem>{ id: "item1", name: "Old Man's War", description: "An old book" }],
        }));

    it("should be case insensitive", () =>
        testFilterSearchResultItems({
            searchResultItems: [<SearchResultItem>{ id: "item1", name: "Item 1", description: "Item 1" }],
            searchTerm: "item",
            fuzziness: 0.6,
            maxSearchResultItems: 10,
            expected: [<SearchResultItem>{ id: "item1", name: "Item 1", description: "Item 1" }],
        }));

    it("should include items that partially match the search term if fuzziness is high", () =>
        testFilterSearchResultItems({
            searchResultItems: [<SearchResultItem>{ id: "item1", name: "Item 1", description: "Item 1" }],
            searchTerm: "itm",
            fuzziness: 0.6,
            maxSearchResultItems: 10,
            expected: [<SearchResultItem>{ id: "item1", name: "Item 1", description: "Item 1" }],
        }));

    it("should exclude items that partially match the search term if fuzziness is low", () =>
        testFilterSearchResultItems({
            searchResultItems: [<SearchResultItem>{ id: "item1", name: "Item 1", description: "Item 1" }],
            searchTerm: "itm",
            fuzziness: 0.2,
            maxSearchResultItems: 10,
            expected: [],
        }));

    it("should limit the search result items", () =>
        testFilterSearchResultItems({
            searchResultItems: [
                <SearchResultItem>{ id: "item1", name: "Item 1", description: "Item 1" },
                <SearchResultItem>{ id: "item2", name: "Item 2", description: "Item 2" },
            ],
            expected: [<SearchResultItem>{ id: "item1", name: "Item 1", description: "Item 1" }],
            fuzziness: 0.6,
            maxSearchResultItems: 1,
            searchTerm: "item",
        }));
});
