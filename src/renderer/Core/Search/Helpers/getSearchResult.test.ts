import type { SearchResultItem } from "@common/Core";
import { describe, expect, it } from "vitest";
import { getSearchResult } from "./getSearchResult";

describe(getSearchResult, () => {
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
            { id: "invalid4", name: "Invalid 4" },
            { id: "invalid5", name: "Invalid 5" },
        ];

        const excludedItemIds = ["item1"];

        const actual = getSearchResult({
            searchEngineId: "Fuse.js",
            favoriteSearchResultItemIds: ["item3"],
            excludedSearchResultItemIds: excludedItemIds,
            instantSearchResultItems,
            searchResultItems,
            searchTerm: "item",
            fuzziness: 0.5,
            maxSearchResultItems: 5,
        });

        expect(actual).toEqual({
            favorites: [{ id: "item3", name: "Item 3" }],
            searchResults: [{ id: "item2", name: "Item 2" }, ...instantSearchResultItems],
        });
    });

    it("should return a list of favorites and other items (sorted alphabetically) if no search term is given", () => {
        const item1 = <SearchResultItem>{ id: "item1", name: "Item 1" };
        const item2 = <SearchResultItem>{ id: "item2", name: "Item 2" };
        const item3 = <SearchResultItem>{ id: "item3", name: "Item 3" };
        const item4 = <SearchResultItem>{ id: "item4", name: "Item 4" };
        const item5 = <SearchResultItem>{ id: "item5", name: "Item 5" };

        const actual = getSearchResult({
            searchEngineId: "fuzzysort",
            favoriteSearchResultItemIds: ["item2", "item3"],
            excludedSearchResultItemIds: ["item1"],
            instantSearchResultItems: <SearchResultItem[]>[
                { id: "instant1", name: "Instant Item 1" },
                { id: "instant2", name: "Instant Item 2" },
                { id: "instant3", name: "Instant Item 3" },
            ],
            searchResultItems: [item5, item1, item3, item2, item4],
            searchTerm: "",
            fuzziness: 0, // will be ignored
            maxSearchResultItems: 3,
        });

        expect(actual).toEqual({
            favorites: [item2, item3],
            searchResults: [item4, item5],
        });
    });
});
