import type { SearchResultItem } from "@common/SearchResultItem";
import type { EventEmitter } from "../EventEmitter";

export class InMemorySearchIndex {
    private index: Record<string, SearchResultItem[]>;

    public constructor(private readonly eventEmitter: EventEmitter) {
        this.index = {};
    }

    public getSearchResultItems(): SearchResultItem[] {
        let result: SearchResultItem[] = [];

        for (const pluginId of Object.keys(this.index)) {
            result = [...result, ...this.index[pluginId]];
        }

        return result;
    }

    public addSearchResultItems(pluginId: string, searchResultItems: SearchResultItem[]): void {
        this.index[pluginId] = searchResultItems;

        this.eventEmitter.emitEvent("searchResultItemsUpdated");
    }
}
