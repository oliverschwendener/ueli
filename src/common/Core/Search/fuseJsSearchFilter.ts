import type { SearchResultItem } from "@common/Core";
import type { SearchOptions } from "@common/Core/Search/SearchOptions";
import Fuse from "fuse.js";
import { SearchResultItemFilter } from "./SearchResultItemFilter";

/**
 * Internal fuse fuzzy search filter.
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
