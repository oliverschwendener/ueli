import type { SearchResultItem } from "@common/Core";
import type { SearchFilter } from "./SearchFilter";
import { SearchResultItemFilter } from "./SearchResultItemFilter";

export const getFilteredSearchResultItems = ({
    searchFilter,
    favoriteSearchResultItemIds,
    excludedSearchResultItemIds,
    instantSearchResultItems,
    searchResultItems,
    searchTerm,
    fuzziness,
    maxSearchResultItems,
}: {
    searchFilter: SearchFilter;
    favoriteSearchResultItemIds: string[];
    excludedSearchResultItemIds: string[];
    instantSearchResultItems: SearchResultItem[];
    searchResultItems: SearchResultItem[];
    searchTerm: string;
    fuzziness: number;
    maxSearchResultItems: number;
}): SearchResultItem[] => {
    searchResultItems = SearchResultItemFilter.createFrom(searchResultItems).exclude(excludedSearchResultItemIds).get();

    if (searchTerm.length > 0) {
        const searchFilterItems = searchFilter({
            searchResultItems,
            searchTerm: searchTerm.trim(),
            fuzziness,
            maxSearchResultItems,
        });

        return [
            ...SearchResultItemFilter.createFrom(searchFilterItems).pick(favoriteSearchResultItemIds).get(),
            ...SearchResultItemFilter.createFrom(searchFilterItems).exclude(favoriteSearchResultItemIds).get(),
            ...instantSearchResultItems,
        ];
    } else {
        return [
            ...SearchResultItemFilter.createFrom(searchResultItems).pick(favoriteSearchResultItemIds).get(),
            ...SearchResultItemFilter.createFrom(searchResultItems)
                .exclude(favoriteSearchResultItemIds)
                .sortAlphabetically()
                .limit(maxSearchResultItems)
                .get(),
        ];
    }
};
