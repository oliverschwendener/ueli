import type { SearchResultItem } from "@Shared/Core";

export type SearchOptions = {
    searchResultItems: SearchResultItem[];
    searchTerm: string;
    fuzziness: number;
    maxSearchResultItems: number;
};
