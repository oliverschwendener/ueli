import { SearchPlugin } from "./search-plugin";
import { SearchResultItem } from "../search-engine";

export class FakePlugin implements SearchPlugin {
    private items: SearchResultItem[];

    constructor(items: SearchResultItem[]) {
        this.items = items;
    }

    public getAllItems(): SearchResultItem[] {
        return this.items;
    }
}