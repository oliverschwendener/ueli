import { SearchResultItem } from "../SearchResultItem";
import { fuseJsSearchFilter } from "./fuseJsSearchFilter";
import { fuzzySortFilter } from "./fuzzySortFilter";
import { SearchOptions } from "./SearchOptions";

const searchFilters = {
    "Fuse.js": (options: SearchOptions) => fuseJsSearchFilter(options),
    "fuzzysort": (options: SearchOptions) => fuzzySortFilter(options),
};

export type SearchEngineId = keyof typeof searchFilters;

export function searchFilter(options: SearchOptions & { searchEngineId: SearchEngineId }): SearchResultItem[] {
    return searchFilters[options.searchEngineId](options);
}
