import type { BrowserWindowNotifier } from "@Core/BrowserWindowNotifier";
import type { SearchResultItem } from "@common/Core";
import type { SearchIndex } from "./Contract";
import type { InMemoryIndex } from "./InMemoryIndex";

export class InMemorySearchIndex implements SearchIndex {
    private index: InMemoryIndex;

    public constructor(private readonly browserWindowNotifier: BrowserWindowNotifier) {
        this.index = {};
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
        this.browserWindowNotifier.notify("searchIndexUpdated");
    }

    public removeSearchResultItems(extensionId: string): void {
        delete this.index[extensionId];
        this.browserWindowNotifier.notify("searchIndexUpdated");
    }

    public getIndex(): InMemoryIndex {
        return this.index;
    }

    public setIndex(index: InMemoryIndex): void {
        this.index = index;
    }
}
