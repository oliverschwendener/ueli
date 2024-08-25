import type { SearchResultItem } from "../SearchResultItem";
import { fuseJsSearchFilter } from "./fuseJsSearchFilter";
import { fuzzySortFilter } from "./fuzzySortFilter";
import type { InternalSearchFilter } from "./InternalSearchFilter";
import type { SearchEngineId } from "./SearchEngineId";
import type { SearchOptions } from "./SearchOptions";

const internalSearchFilters: Record<SearchEngineId, InternalSearchFilter> = {
    "Fuse.js": (options: SearchOptions) => fuseJsSearchFilter(options),
    fuzzysort: (options: SearchOptions) => fuzzySortFilter(options),
};

export const searchFilter = (options: SearchOptions, searchEngineId: SearchEngineId): SearchResultItem[] =>
    internalSearchFilters[searchEngineId](options);
