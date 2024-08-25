import Fuse from "fuse.js";
import type { InternalSearchFilter } from "./InternalSearchFilter";
import { SearchResultItemFilter } from "./SearchResultItemFilter";

/**
 * Internal search filter using the fuse.js library.
 */
export const fuseJsSearchFilter: InternalSearchFilter = ({
    searchResultItems,
    fuzziness,
    maxSearchResultItems,
    searchTerm,
}) => {
    const result = new Fuse(searchResultItems, {
        keys: ["name"],
        threshold: fuzziness,
        shouldSort: true,
    })
        .search(searchTerm)
        .map((i) => i.item);

    return SearchResultItemFilter.createFrom(result).limit(maxSearchResultItems).get();
};
