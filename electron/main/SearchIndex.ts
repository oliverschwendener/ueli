import { SearchResultItem } from "@common/SearchResultItem";

export class SearchIndex {
    private index: Record<string, SearchResultItem[]>;

    public constructor(private readonly onSearchIndexUpdated: () => void) {
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
        this.onSearchIndexUpdated();
    }
}
