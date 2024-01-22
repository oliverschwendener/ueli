import type { ExcludedSearchResultItem, SearchResultItem } from "@common/Core";
import Fuse from "fuse.js";

type SearchOptions = {
    searchTerm: string;
    fuzziness: number;
};

export const filterSearchResultItemsBySearchTerm = ({
    searchOptions,
    excludedSearchResultItems,
    searchResultItems,
}: {
    searchResultItems: SearchResultItem[];
    excludedSearchResultItems: ExcludedSearchResultItem[];
    searchOptions: SearchOptions;
}): SearchResultItem[] => {
    return new Fuse(
        searchResultItems.filter((s) => !excludedSearchResultItems.map((e) => e.id).includes(s.id)),
        {
            keys: ["name"],
            threshold: searchOptions.fuzziness,
            shouldSort: true,
        },
    )
        .search(searchOptions.searchTerm)
        .map((i) => i.item);
};
