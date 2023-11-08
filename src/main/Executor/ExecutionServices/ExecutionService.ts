import type { SearchResultItem } from "@common/SearchResultItem";

export interface ExecutionService {
    execute(searchResultItem: SearchResultItem): Promise<void>;
}
