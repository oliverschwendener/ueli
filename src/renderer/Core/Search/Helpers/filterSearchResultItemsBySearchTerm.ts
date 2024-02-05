import type { SearchResultItem } from "@common/Core";
import Fuse from "fuse.js";

type SearchOptions = {
    searchTerm: string;
    fuzziness: number;
    maxResultLength: number;
};

export const filterSearchResultItemsBySearchTerm = ({
    searchOptions,
    excludedIds,
    searchResultItems,
}: {
    searchResultItems: SearchResultItem[];
    excludedIds: string[];
    searchOptions: SearchOptions;
}): SearchResultItem[] => {
    const { fuzziness, maxResultLength, searchTerm } = searchOptions;

    const result = new Fuse(
        searchResultItems.filter((s) => !excludedIds.includes(s.id)),
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
