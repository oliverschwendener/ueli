import type { SearchResultItem } from "@common/Core";

export const limitSearchResultItems = (searchResultItems: SearchResultItem[], limit: number): SearchResultItem[] => {
    searchResultItems.splice(limit, searchResultItems.length - limit);
    return searchResultItems;
};
