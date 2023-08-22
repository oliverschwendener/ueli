import { SearchResultItem } from "@common/SearchResultItem";

export const filterSearchResultItemsBySearchTerm = (searchResultItems: SearchResultItem[], searchTerm: string) =>
    searchResultItems.filter((searchResultItem) =>
        searchResultItem.name.toLowerCase().includes(searchTerm.trim().toLowerCase()),
    );
