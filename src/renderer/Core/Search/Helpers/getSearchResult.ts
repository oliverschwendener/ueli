import type { InstantSearchResultItems, SearchResultItem } from "@common/Core";
import { searchFilter, SearchResultItemFilter, type SearchEngineId } from "@common/Core/Search";

export const getSearchResult = ({
    searchEngineId,
    favoriteSearchResultItemIds,
    excludedSearchResultItemIds,
    instantSearchResultItems,
    searchResultItems,
    searchTerm,
    fuzziness,
    maxSearchResultItems,
}: {
    searchEngineId: SearchEngineId;
    favoriteSearchResultItemIds: string[];
    excludedSearchResultItemIds: string[];
    instantSearchResultItems: InstantSearchResultItems;
    searchResultItems: SearchResultItem[];
    searchTerm: string;
    fuzziness: number;
    maxSearchResultItems: number;
}): Record<string, SearchResultItem[]> => {
    searchResultItems = SearchResultItemFilter.createFrom(searchResultItems).exclude(excludedSearchResultItemIds).get();

    if (searchTerm.length > 0) {
        const searchFilterItems = searchFilter(
            {
                searchResultItems,
                searchTerm: searchTerm.trim(),
                fuzziness,
                maxSearchResultItems,
            },
            searchEngineId,
        );

        return {
            favorites: SearchResultItemFilter.createFrom(searchFilterItems).pick(favoriteSearchResultItemIds).get(),
            searchResults: [
                ...instantSearchResultItems.before,
                ...SearchResultItemFilter.createFrom(searchFilterItems).exclude(favoriteSearchResultItemIds).get(),
                ...instantSearchResultItems.after,
            ],
        };
    } else {
        return {
            favorites: SearchResultItemFilter.createFrom(searchResultItems)
                .pick(favoriteSearchResultItemIds)
                .sortAlphabetically()
                .get(),
            searchResults: SearchResultItemFilter.createFrom(searchResultItems)
                .exclude(favoriteSearchResultItemIds)
                .sortAlphabetically()
                .limit(maxSearchResultItems)
                .get(),
        };
    }
};
