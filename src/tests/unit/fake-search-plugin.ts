import { SearchPlugin } from "../../ts/search-plugins/search-plugin";
import { SearchResultItem } from "../../ts/search-result-item";

export class FakeSearchPlugin implements SearchPlugin {
    private readonly searchResultItems: SearchResultItem[];

    constructor(searchResultItems: SearchResultItem[]) {
        this.searchResultItems = searchResultItems;
    }

    public getIndexLength(): number {
        return this.searchResultItems.length;
    }

    public getAllItems(): SearchResultItem[] {
        return this.searchResultItems;
    }
}
