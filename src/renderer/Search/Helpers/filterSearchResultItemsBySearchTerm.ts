import { SearchResultItem } from "@common/SearchResultItem";
import Fuse from "fuse.js";

type SearchOptions = {
    searchTerm: string;
    fuzzyness: number;
};

export const filterSearchResultItemsBySearchTerm = (
    searchResultItems: SearchResultItem[],
    searchOptions: SearchOptions,
): SearchResultItem[] => {
    return new Fuse(searchResultItems, {
        keys: ["name"],
        threshold: searchOptions.fuzzyness,
        shouldSort: true,
    })
        .search(searchOptions.searchTerm)
        .map((i) => i.item);
};
