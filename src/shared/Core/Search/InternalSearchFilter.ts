import type { SearchResultItem } from "@shared/Core";

import type { SearchOptions } from "./SearchOptions";

export type InternalSearchFilter = (options: SearchOptions) => SearchResultItem[];
