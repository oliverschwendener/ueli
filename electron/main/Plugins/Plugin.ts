export interface Plugin {
    getId(): string;
    addSearchResultItemsToSearchIndex(): Promise<void>;
}
