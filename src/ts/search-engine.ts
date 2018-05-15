import * as Fuse from "fuse.js";
import { SearchPlugin } from "./search-plugins/search-plugin";
import { SearchResultItem } from "./search-result-item";
import { CountManager } from "./count-manager";

export class SearchEngine {
    private unsortedSearchResults: SearchResultItem[];

    public constructor(unsortedSearchResults: SearchResultItem[]) {
        this.unsortedSearchResults = unsortedSearchResults;
    }

    public search(searchTerm: string, countManager?: CountManager): SearchResultItem[] {
        const fuse = new Fuse(this.unsortedSearchResults, {
            distance: 100,
            includeScore: true,
            keys: ["name", "tags"],
            location: 0,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            shouldSort: true,
            threshold: 0.4,
        });

        let fuseResults = fuse.search(searchTerm) as any[];

        if (countManager !== undefined) {
            fuseResults = this.sortItemsByCount(fuseResults, countManager);
        }

        const sortedResult = fuseResults.map((fuseResult): SearchResultItem => {
            return {
                executionArgument: fuseResult.item.executionArgument,
                icon: fuseResult.item.icon,
                name: fuseResult.item.name,
                tags: fuseResult.item.tags,
            } as SearchResultItem;
        });

        return sortedResult;
    }

    private sortItemsByCount(searchResults: any[], countManager: CountManager): any[] {
        const count = countManager.getCount();

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < searchResults.length; i++) {
            const score = count[searchResults[i].item.executionArgument];

            if (score !== undefined) {
                searchResults[i].score /= (score * 0.25);
            }
        }

        searchResults = searchResults.sort((a, b) => {
            if (a.score > b.score) {
                return 1;
            } else if (a.score < b.score) {
                return -1;
            } else {
                return 0;
            }
        });

        return searchResults;
    }
}
