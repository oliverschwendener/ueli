export interface ExcludedSearchResults {
    add(id: string): Promise<void>;
    remove(id: string): Promise<void>;
    getExcludedIds(): string[];
}
