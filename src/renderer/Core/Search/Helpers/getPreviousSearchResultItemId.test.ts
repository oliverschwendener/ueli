import type { SearchResultItem } from "@common/Core";
import { describe, expect, it } from "vitest";
import { getPreviousSearchResultItemId } from "./getPreviousSearchResultItemId";

describe(getPreviousSearchResultItemId, () => {
    const searchResultItems = <SearchResultItem[]>[{ id: "a" }, { id: "b" }, { id: "c" }];

    it("should return the id of the previous search result item", () =>
        expect(getPreviousSearchResultItemId("b", searchResultItems)).toBe("a"));

    it("should return the id of the last item if the currently selected item is the first in the list", () =>
        expect(getPreviousSearchResultItemId("a", searchResultItems)).toBe("c"));

    it("should return an empty string if the search result item list is empty", () =>
        expect(getPreviousSearchResultItemId("a", [])).toBe(""));
});
