import type { InstantSearchResultItems } from "@shared/Core";

export const createEmptyInstantSearchResult = (): InstantSearchResultItems => ({
    after: [],
    before: [],
});
