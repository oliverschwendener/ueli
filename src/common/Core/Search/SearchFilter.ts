import type { SearchResultItem } from "../SearchResultItem";
import { fuseJsSearchFilter } from "./fuseJsSearchFilter";
import { fuzzySortFilter } from "./fuzzySortFilter";
import type { SearchOptions } from "./SearchOptions";

const searchFilters = {
    "Fuse.js": (options: SearchOptions) => fuseJsSearchFilter(options),
    fuzzysort: (options: SearchOptions) => fuzzySortFilter(options),
};

export type SearchEngineId = keyof typeof searchFilters;

export const searchFilter = (options: SearchOptions, searchEngineId: SearchEngineId): SearchResultItem[] =>
    searchFilters[searchEngineId](options);
