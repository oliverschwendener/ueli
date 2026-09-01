import type { SearchResultItem } from "@shared/Core";

export interface SystemCommand {
    getId(): string;
    invoke: () => Promise<void>;
    toSearchResultItem(): SearchResultItem;
}
