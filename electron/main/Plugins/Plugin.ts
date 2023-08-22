import { SearchResultItem } from "@common/SearchResultItem";

export interface Plugin {
    getId(): string;
    getAllSearchResultItems(): Promise<SearchResultItem[]>;
}
