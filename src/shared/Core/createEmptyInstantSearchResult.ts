import type { InstantSearchResultItems } from "@Shared/Core";

export const createEmptyInstantSearchResult = (): InstantSearchResultItems => ({
    after: [],
    before: [],
});
