import * as Fuse from "fuse.js";
import { SearchPlugin } from "./plugins/search-plugin";

export class SearchEngine {
    private unsortedSearchResults: SearchResultItem[];

    constructor(unsortedSearchResults: SearchResultItem[]) {
        this.unsortedSearchResults = unsortedSearchResults;
    }

    public search(searchTerm: string): SearchResultItem[] {
        let fuse = new Fuse(this.unsortedSearchResults, {
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
                icon: f.item.icon,
                tags: f.item.tags
            };
        });

        return result;
    }
}

export class SearchResultItem {
    public name: string;
    public executionArgument: string;
    public icon: string;
    public tags: string[];
}