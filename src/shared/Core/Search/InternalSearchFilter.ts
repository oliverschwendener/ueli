import type { SearchResultItem } from "@Shared/Core";

import type { SearchOptions } from "./SearchOptions";

export type InternalSearchFilter = (options: SearchOptions) => SearchResultItem[];
