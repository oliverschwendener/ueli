import type { SearchResultItem } from "../SearchResultItem";

export class SearchResultItemFilter {
    private constructor(private searchResultItems: SearchResultItem[]) {}

    public static createFrom(searchResultItems: SearchResultItem[]): SearchResultItemFilter {
        return new SearchResultItemFilter(searchResultItems);
    }

    public exclude(ids: string[]): SearchResultItemFilter {
        this.searchResultItems = this.searchResultItems.filter((s) => !ids.includes(s.id));
        return this;
    }

    public pick(ids: string[]): SearchResultItemFilter {
        this.searchResultItems = this.searchResultItems.filter((s) => ids.includes(s.id));
        return this;
    }

    public limit(maxSearchResultItems: number): SearchResultItemFilter {
        this.searchResultItems.splice(maxSearchResultItems, this.searchResultItems.length - maxSearchResultItems);
        return this;
    }

    public sortAlphabetically(): SearchResultItemFilter {
        this.searchResultItems.sort((a, b) => a.name.localeCompare(b.name));
        return this;
    }

    public get(): SearchResultItem[] {
        return this.searchResultItems;
    }
}
