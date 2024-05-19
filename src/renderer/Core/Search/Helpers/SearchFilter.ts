import type { SearchResultItem } from "@common/Core";
import type { SearchOptions } from "./SearchOptions";

export type SearchFilter = (options: SearchOptions) => SearchResultItem[];
