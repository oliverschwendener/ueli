import type { SearchResultItem } from "@common/Core";
import type { EventEmitter } from "../EventEmitter";
import type { SearchIndex } from "./Contract";
import type { InMemoryIndex } from "./InMemoryIndex";

export class InMemorySearchIndex implements SearchIndex {
    private index: InMemoryIndex;

    public constructor(private readonly eventEmitter: EventEmitter) {
        this.index = {};
    }

    public getById(id: string): SearchResultItem {
        for (const searchResultItems of Object.values(this.index)) {
            for (const searchResultItem of searchResultItems) {
                if (searchResultItem.id === id) {
                    return searchResultItem;
                }
            }
        }

        return undefined;
    }

    public getSearchResultItems(): SearchResultItem[] {
        let result: SearchResultItem[] = [];

        for (const extensionId of Object.keys(this.index)) {
            result = [...result, ...this.index[extensionId]];
        }

        return result;
    }

    public addSearchResultItems(extensionId: string, searchResultItems: SearchResultItem[]): void {
        this.index[extensionId] = searchResultItems;

        this.eventEmitter.emitEvent("searchIndexUpdated");
    }

    public removeSearchResultItems(extensionId: string): void {
        delete this.index[extensionId];

        this.eventEmitter.emitEvent("searchIndexUpdated");
    }

    public getIndex(): InMemoryIndex {
        return this.index;
    }

    public setIndex(index: InMemoryIndex): void {
        this.index = index;
    }
}
