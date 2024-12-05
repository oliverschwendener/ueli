import type { SearchResultItem } from "@common/Core";

export const createEmptyInstantSearchResult = (): InstantSearchResultItems => ({
    after: [],
    before: [],
});

export type InstantSearchResultItems = {
    after: SearchResultItem[];
    before: SearchResultItem[];
};
