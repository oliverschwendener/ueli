import type { SearchResultItem } from "@common/Core";
import { describe, expect, it } from "vitest";
import { limitSearchResultItems } from "./limitSearchResultItems";

describe(limitSearchResultItems, () => {
    it("should return the original search result item list if the limit is greater than the length of the list", () => {
        const searchResultItems = <SearchResultItem[]>[{ id: "1" }, { id: "2" }, { id: "3" }];
        expect(limitSearchResultItems(searchResultItems, 4)).toBe(searchResultItems);
    });

    it("should return a shortened list if the limit is smaller than the length of the list", () => {
        const searchResultItems = <SearchResultItem[]>[{ id: "1" }, { id: "2" }, { id: "3" }];
        expect(limitSearchResultItems(searchResultItems, 2)).toEqual([{ id: "1" }, { id: "2" }]);
    });
});
