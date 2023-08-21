import { describe, it, expect } from "vitest";
import { filterSearchResultItemsBySearchTerm } from "./filterSearchResultItemsBySearchTerm";
import { SearchResultItem } from "@common/SearchResultItem";

const testFilterSearchResultItemsBySearchTerm = ({
    searchResultItems,
    searchTerm,
    expected,
}: {
    expected: SearchResultItem[];
    searchResultItems: SearchResultItem[];
    searchTerm: string;
}) => expect(filterSearchResultItemsBySearchTerm(searchResultItems, searchTerm)).toEqual(expected);

describe(filterSearchResultItemsBySearchTerm, () => {
    it("should return an empty list if search result items are empty", () =>
        testFilterSearchResultItemsBySearchTerm({
            searchResultItems: [],
            searchTerm: "search term",
            expected: [],
        }));

    it("should return an empty list if search term does not match any of the search result items", () =>
        testFilterSearchResultItemsBySearchTerm({
            searchResultItems: [{ id: "item1", name: "Item 1", description: "Item 1" }],
            searchTerm: "search term",
            expected: [],
        }));

    it("should return list of one item if search term matches one search result item", () =>
        testFilterSearchResultItemsBySearchTerm({
            searchResultItems: [
                { id: "item1", name: "Item 1", description: "Item 1" },
                { id: "item2", name: "Item 2", description: "Item 2" },
            ],
            searchTerm: "item 1",
            expected: [{ id: "item1", name: "Item 1", description: "Item 1" }],
        }));
});
