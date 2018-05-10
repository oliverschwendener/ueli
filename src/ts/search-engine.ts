import * as Fuse from "fuse.js";
import { SearchPlugin } from "./search-plugins/search-plugin";
import { SearchResultItem } from "./search-result-item";
import { CountManager } from "./count-manager";

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
            threshold: 0.4,
        });

        const fuseResults = fuse.search(searchTerm) as any[];

        this.sortByCount(fuseResults);

        const result = fuseResults.map((fuseResult): SearchResultItem => {
            return {
                executionArgument: fuseResult.item.executionArgument,
                icon: fuseResult.item.icon,
                name: fuseResult.item.name,
                tags: fuseResult.item.tags,
            } as SearchResultItem;
        });

        return result;
    }

    private sortByCount(fuseResults: any[]) {
        const count = new CountManager();

        for (let i = 0; i < fuseResults.length; i++) {
            for (let j = i; j < fuseResults.length; j++) {
                const scoreA = fuseResults[i].score - count.getCount(fuseResults[i].item.executionArgument) / 100;
                const scoreB = fuseResults[j].score - count.getCount(fuseResults[j].item.executionArgument) / 100;
                if (scoreA > scoreB) {
                    const temp = fuseResults[i];
                    fuseResults[i] = fuseResults[j];
                    fuseResults[j] = temp;
                }
            }
        }
    }
}
