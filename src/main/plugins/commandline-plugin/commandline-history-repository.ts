import { SearchResultItem } from "../../../common/search-result-item";

export interface CommandlineHistoryRepository {
    getAll(): SearchResultItem[];
    add(historyItem: SearchResultItem): void;
    refreshIndex(): Promise<void>;
    clearAll(): Promise<void>;
}