import type { SearchResultItem } from "@common/Core";
import Fuse from "fuse.js";
import type { SearchFilter } from "./SearchFilter";
import type { SearchOptions } from "./SearchOptions";
import { limitSearchResultItems } from "./limitSearchResultItems";

export const fuseJsSearchFilter: SearchFilter = ({
    searchResultItems,
    fuzziness,
    maxSearchResultItems,
    searchTerm,
}: SearchOptions): SearchResultItem[] => {
    const result = new Fuse(searchResultItems, {
        keys: ["name"],
        threshold: fuzziness,
        shouldSort: true,
    })
        .search(searchTerm)
        .map((i) => i.item);

    return limitSearchResultItems(result, maxSearchResultItems);
};
