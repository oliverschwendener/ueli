import { describe, expect, test } from "vitest";
import type { SearchEngineId } from "./SearchEngineId";
import { searchFilter } from "./SearchFilter";

describe(searchFilter, () => {
    test.for<SearchEngineId>(["Fuse.js", "fuzzysort"])(
        "should return an empty list if search result items are empty with %s",
        (searchEngineId) => {
            const actual = searchFilter(
                {
                    searchResultItems: [],
                    searchTerm: "search term",
                    fuzziness: 0.5,
                    maxSearchResultItems: 10,
                },
                searchEngineId,
            );

            expect(actual).toEqual([]);
        },
    );
});
