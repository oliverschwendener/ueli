import * as Fuse from "fuse.js";
import { SearchPlugin } from "./search-plugins/search-plugin";
import { SearchResultItem } from "./search-result-item";

export class SearchEngine {
    private unsortedSearchResults: SearchResultItem[];

    public constructor(unsortedSearchResults: SearchResultItem[]) {
        this.unsortedSearchResults = unsortedSearchResults;
    }

    public search(searchTerm: string): SearchResultItem[] {
        const fuse = new Fuse(this.unsortedSearchResults, {
            distance: 100,
            includeScore: true,
            keys: ["name", "tags"],
            location: 0,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            shouldSort: true,
            threshold: 0.6,
        });

        const fuseResult = fuse.search(searchTerm) as any[];

        const result = fuseResult.map((f): SearchResultItem => {
            return {
                executionArgument: f.item.executionArgument,
                icon: f.item.icon,
                name: f.item.name,
                tags: f.item.tags,
            } as SearchResultItem;
        });

        return result;
    }
}
