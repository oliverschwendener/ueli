import type { InstantSearchResultItems } from "@common/Core";

export const createEmptyInstantSearchResult = (): InstantSearchResultItems => ({
    after: [],
    before: [],
});
