import type { SearchResultItem } from "@common/Core";
import { describe, expect, it } from "vitest";
import { SearchResultItemFilter } from "./SearchResultItemFilter";

describe(SearchResultItemFilter, () => {
    describe(SearchResultItemFilter.prototype.exclude, () => {
        it("should exclude search result items by id", () => {
            const searchResultItems = <SearchResultItem[]>[{ id: "1" }, { id: "2" }, { id: "3" }];
            const result = SearchResultItemFilter.createFrom(searchResultItems).exclude(["1", "3"]).get();
            expect(result).toEqual([{ id: "2" }]);
        });
    });

    describe(SearchResultItemFilter.prototype.pick, () => {
        it("should pick search result items by id", () => {
            const searchResultItems = <SearchResultItem[]>[{ id: "1" }, { id: "2" }, { id: "3" }];
            const result = SearchResultItemFilter.createFrom(searchResultItems).pick(["1", "3"]).get();
            expect(result).toEqual([{ id: "1" }, { id: "3" }]);
        });
    });

    describe(SearchResultItemFilter.prototype.limit, () => {
        it("should limit search result items", () => {
            const searchResultItems = <SearchResultItem[]>[{ id: "1" }, { id: "2" }, { id: "3" }];
            const result = SearchResultItemFilter.createFrom(searchResultItems).limit(2).get();
            expect(result).toEqual([{ id: "1" }, { id: "2" }]);
        });

        it("should not limit search result items if given limit is greater than the number of search result items", () => {
            const searchResultItems = <SearchResultItem[]>[{ id: "1" }, { id: "2" }, { id: "3" }];
            const result = SearchResultItemFilter.createFrom(searchResultItems).limit(4).get();
            expect(result).toEqual([{ id: "1" }, { id: "2" }, { id: "3" }]);
        });
    });
});
