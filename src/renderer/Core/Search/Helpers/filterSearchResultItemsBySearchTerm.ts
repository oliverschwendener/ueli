import type { SearchResultItem } from "@common/Core";
import Fuse from "fuse.js";

type SearchOptions = {
    searchTerm: string;
    fuzziness: number;
};

export const filterSearchResultItemsBySearchTerm = (
    searchResultItems: SearchResultItem[],
    searchOptions: SearchOptions,
): SearchResultItem[] => {
    return new Fuse(searchResultItems, {
        keys: ["name"],
        threshold: searchOptions.fuzziness,
        shouldSort: true,
    })
        .search(searchOptions.searchTerm)
        .map((i) => i.item);
};
