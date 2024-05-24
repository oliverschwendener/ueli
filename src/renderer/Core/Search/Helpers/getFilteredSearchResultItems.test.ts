import type { SearchResultItem } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import { getFilteredSearchResultItems } from "./getFilteredSearchResultItems";

describe(getFilteredSearchResultItems, () => {
    it("should return an array of instant search result items, favorites and other matches if a search term is given", () => {
        const instantSearchResultItems = <SearchResultItem[]>[
            { id: "instant1", name: "Instant Item 1" },
            { id: "instant2", name: "Instant Item 2" },
            { id: "instant3", name: "Instant Item 3" },
        ];

        const searchResultItems = <SearchResultItem[]>[
            { id: "item1", name: "Item 1" },
            { id: "item2", name: "Item 2" },
            { id: "item3", name: "Item 3" },
            { id: "item4", name: "Item 4" },
            { id: "item5", name: "Item 5" },
        ];

        const searchFilter = vi.fn().mockReturnValue(<SearchResultItem[]>[
            { id: "item2", name: "Item 2" },
            { id: "item3", name: "Item 3" },
        ]);

        const excludedItemIds = ["item1"];

        const actual = getFilteredSearchResultItems({
            searchFilter,
            favoriteSearchResultItemIds: ["item3"],
            excludedSearchResultItemIds: excludedItemIds,
            instantSearchResultItems,
            searchResultItems,
            searchTerm: "test search term",
            fuzziness: 0.5,
            maxSearchResultItems: 5,
        });

        expect(actual).toEqual([
            ...instantSearchResultItems,
            ...[
                { id: "item3", name: "Item 3" },
                { id: "item2", name: "Item 2" },
            ],
        ]);

        expect(searchFilter).toHaveBeenCalledOnce();
        expect(searchFilter).toHaveBeenCalledWith({
            searchResultItems: searchResultItems.filter((s) => !excludedItemIds.includes(s.id)),
            searchTerm: "test search term",
            fuzziness: 0.5,
            maxSearchResultItems: 5,
        });
    });

    it("should return a list of favorites and other items (sorted alphabetically) if no search term is given", () => {
        const item1 = <SearchResultItem>{ id: "item1", name: "Item 1" };
        const item2 = <SearchResultItem>{ id: "item2", name: "Item 2" };
        const item3 = <SearchResultItem>{ id: "item3", name: "Item 3" };
        const item4 = <SearchResultItem>{ id: "item4", name: "Item 4" };
        const item5 = <SearchResultItem>{ id: "item5", name: "Item 5" };

        const excludedItemIds = ["item1"];

        const actual = getFilteredSearchResultItems({
            searchFilter: vi.fn(),
            favoriteSearchResultItemIds: ["item3"],
            excludedSearchResultItemIds: excludedItemIds,
            instantSearchResultItems: <SearchResultItem[]>[
                { id: "instant1", name: "Instant Item 1" },
                { id: "instant2", name: "Instant Item 2" },
                { id: "instant3", name: "Instant Item 3" },
            ],
            searchResultItems: [item2, item1, item4, item5, item3],
            searchTerm: "",
            fuzziness: 0, // will be ignored
            maxSearchResultItems: 3,
        });

        expect(actual).toEqual([...[{ id: "item3", name: "Item 3" }], ...[item2, item4, item5]]);
    });
});
