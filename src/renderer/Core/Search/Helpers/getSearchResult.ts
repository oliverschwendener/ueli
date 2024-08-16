import type { SearchResultItem } from "@common/Core";
import { SearchEngineId, searchFilter } from "@common/Core/Search/SearchFilter";
import { SearchResultItemFilter } from "@common/Core/Search/SearchResultItemFilter";

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
    instantSearchResultItems: SearchResultItem[];
    searchResultItems: SearchResultItem[];
    searchTerm: string;
    fuzziness: number;
    maxSearchResultItems: number;
}): Record<string, SearchResultItem[]> => {
    searchResultItems = SearchResultItemFilter.createFrom(searchResultItems).exclude(excludedSearchResultItemIds).get();

    if (searchTerm.length > 0) {
        const searchFilterItems = searchFilter({
            searchEngineId,
            searchResultItems,
            searchTerm: searchTerm.trim(),
            fuzziness,
            maxSearchResultItems,
        });

        return {
            favorites: SearchResultItemFilter.createFrom(searchFilterItems).pick(favoriteSearchResultItemIds).get(),
            searchResults: [
                ...SearchResultItemFilter.createFrom(searchFilterItems).exclude(favoriteSearchResultItemIds).get(),
                ...instantSearchResultItems,
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
