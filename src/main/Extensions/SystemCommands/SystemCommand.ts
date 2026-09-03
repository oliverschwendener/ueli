import type { SearchResultItem } from "@Shared/Core";

export interface SystemCommand {
    getId(): string;
    invoke: () => Promise<void>;
    toSearchResultItem(): SearchResultItem;
}
