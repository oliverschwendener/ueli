import type { SearchResultItem } from "@common/SearchResultItem";
import type { EventEmitter } from "../EventEmitter";
import type { InMemoryIndex } from "./InMemoryIndex";
import type { SearchIndex } from "./SearchIndex";

export class InMemorySearchIndex implements SearchIndex {
    private index: InMemoryIndex;

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

        this.eventEmitter.emitEvent("searchIndexUpdated");
    }

    public removeSearchResultItems(pluginId: string): void {
        delete this.index[pluginId];

        this.eventEmitter.emitEvent("searchIndexUpdated");
    }

    public getIndex(): InMemoryIndex {
        return this.index;
    }

    public setIndex(index: InMemoryIndex): void {
        this.index = index;
    }
}
