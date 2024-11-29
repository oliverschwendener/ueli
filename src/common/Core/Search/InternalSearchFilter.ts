import type { SearchResultItem } from "@common/Core";
import type { SearchOptions } from "./SearchOptions";

export type InternalSearchFilter = (options: SearchOptions) => SearchResultItem[];
