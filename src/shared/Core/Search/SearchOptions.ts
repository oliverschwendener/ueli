import type { SearchResultItem } from "@shared/Core";

export type SearchOptions = {
    searchResultItems: SearchResultItem[];
    searchTerm: string;
    fuzziness: number;
    maxSearchResultItems: number;
};
