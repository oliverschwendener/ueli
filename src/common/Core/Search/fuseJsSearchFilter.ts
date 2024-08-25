import type { SearchResultItem } from "@common/Core";
import Fuse from "fuse.js";
import type { SearchOptions } from "./SearchOptions";
import { SearchResultItemFilter } from "./SearchResultItemFilter";

/**
 * Internal search filter using the fuse.js library.
 */
export const fuseJsSearchFilter = ({
    searchResultItems,
    fuzziness,
    maxSearchResultItems,
    searchTerm,
}: SearchOptions): SearchResultItem[] => {
    const result = new Fuse(searchResultItems, {
        keys: ["name"],
        threshold: fuzziness,
        shouldSort: true,
    })
        .search(searchTerm)
        .map((i) => i.item);

    return SearchResultItemFilter.createFrom(result).limit(maxSearchResultItems).get();
};
