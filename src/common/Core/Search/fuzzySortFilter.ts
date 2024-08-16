import type { SearchResultItem } from "@common/Core";
import type { SearchFilter } from "@common/Core/Search/SearchFilter";
import type { SearchOptions } from "@common/Core/Search/SearchOptions";
import fuzzysort from "fuzzysort";

export const fuzzySortFilter: SearchFilter = ({
    fuzziness,
    maxSearchResultItems,
    searchResultItems,
    searchTerm,
}: SearchOptions): SearchResultItem[] => {
    // We need to invert the fuzziness value when using fuzzysort, as here a lower fuzziness value means a more
    // strict search
    const threshold = Math.round((1 - fuzziness) * 10) / 10;

    return fuzzysort
        .go(searchTerm, searchResultItems, {
            threshold,
            limit: maxSearchResultItems,
            key: "name",
        })
        .map((item) => item.obj);
};
