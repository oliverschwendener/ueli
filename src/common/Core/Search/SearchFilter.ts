import type { SearchResultItem } from "@common/Core";
import type { SearchOptions } from "../../../renderer/Core/Search/Helpers/SearchOptions";

export type SearchFilter = (options: SearchOptions) => SearchResultItem[];
