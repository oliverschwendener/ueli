import type { ExcludedSearchResultItem, SearchResultItem } from "@common/Core";
import Fuse from "fuse.js";

type SearchOptions = {
    searchTerm: string;
    fuzziness: number;
    maxResultLength: number;
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
    const { fuzziness, maxResultLength, searchTerm } = searchOptions;

    const result = new Fuse(
        searchResultItems.filter((s) => !excludedSearchResultItems.map((e) => e.id).includes(s.id)),
        {
            keys: ["name"],
            threshold: fuzziness,
            shouldSort: true,
        },
    )
        .search(searchTerm)
        .map((i) => i.item);

    result.splice(maxResultLength, result.length - maxResultLength);

    return result;
};
