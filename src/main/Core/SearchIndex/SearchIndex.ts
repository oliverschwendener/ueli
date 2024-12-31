import type { BrowserWindowNotifier } from "@Core/BrowserWindowNotifier";
import type { SearchResultItem } from "@common/Core";
import type { SearchIndex as SearchIndexInterface } from "./Contract";
import type { SearchIndexFile } from "./Contract/SearchIndexFile";
import type { Index } from "./Contract/SearchIndexStructure";

export class SearchIndex implements SearchIndexInterface {
    private index: Index;

    public constructor(
        private readonly browserWindowNotifier: BrowserWindowNotifier,
        private readonly indexFile: SearchIndexFile,
    ) {
        this.index = indexFile.read();
    }

    public set(index: Index): void {
        this.index = index;
        this.indexFile.write(this.index);
        this.browserWindowNotifier.notifyAll({ channel: "searchIndexUpdated" });
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
        this.indexFile.write(this.index);
        this.browserWindowNotifier.notifyAll({ channel: "searchIndexUpdated" });
    }

    public removeSearchResultItems(extensionId: string): void {
        delete this.index[extensionId];
        this.indexFile.write(this.index);
        this.browserWindowNotifier.notifyAll({ channel: "searchIndexUpdated" });
    }
}
