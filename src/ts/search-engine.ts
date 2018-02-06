import * as Fuse from "fuse.js";
import { SearchPlugin } from "./plugins/search-plugin";

export class SearchEngine {
    private plugins: SearchPlugin[];

    constructor(plugins: SearchPlugin[]) {
        this.plugins = plugins;
    }

    public search(searchTerm: string): SearchResultItem[] {
        let allItems = this.getAllSearchResultItems();

        let fuse = new Fuse(allItems, {
            shouldSort: true,
            includeScore: true,
            keys: ["name", "tags"],
            distance: 100,
            threshold: 0.6,
            location: 0,
            maxPatternLength: 32,
            minMatchCharLength: 1,
        });

        let fuseResult = fuse.search(searchTerm) as any[];

        let result = fuseResult.map((f) => {
            return <SearchResultItem>{
                name: f.item.name,
                executionArgument: f.item.executionArgument,
                tags: f.item.tags
            };
        });

        return result;
    }

    private getAllSearchResultItems(): SearchResultItem[] {
        let result = [] as SearchResultItem[];

        for (let plugin of this.plugins) {
            result = result.concat(plugin.getAllItems())
        }

        return result;
    }
}

export class SearchResultItem {
    public name: string;
    public executionArgument: string;
    public tags: string[];
}