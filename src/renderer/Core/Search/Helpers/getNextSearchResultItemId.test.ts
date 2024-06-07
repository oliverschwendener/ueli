import type { SearchResultItem } from "@common/Core";
import { describe, expect, it } from "vitest";
import { getNextSearchResultItemId } from "./getNextSearchResultItemId";

describe(getNextSearchResultItemId, () => {
    const searchResultItems = <SearchResultItem[]>[{ id: "a" }, { id: "b" }, { id: "c" }];

    it("should return the id of the next search result item", () =>
        expect(getNextSearchResultItemId("a", searchResultItems)).toBe("b"));

    it("should return the id of the first item if the currently selected item is the last in the list", () =>
        expect(getNextSearchResultItemId("c", searchResultItems)).toBe("a"));

    it("should return an empty string if the search result item list is empty", () =>
        expect(getNextSearchResultItemId("a", [])).toBe(""));
});
