import type { SearchResultItem } from "@common/Core";

export type SearchOptions = {
    searchResultItems: SearchResultItem[];
    searchTerm: string;
    fuzziness: number;
    maxSearchResultItems: number;
};
