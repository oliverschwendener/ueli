import type { SearchResultItem } from "../SearchResultItem";
import type { SearchOptions } from "./SearchOptions";

export type InternalSearchFilter = (options: SearchOptions) => SearchResultItem[];
