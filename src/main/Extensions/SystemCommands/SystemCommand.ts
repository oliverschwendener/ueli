import type { SearchResultItem } from "@common/Core";

export interface SystemCommand {
    getId(): string;
    invoke: () => Promise<void>;
    toSearchResultItem(): SearchResultItem;
}
