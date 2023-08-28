export interface Plugin {
    addSearchResultItemsToSearchIndex(): Promise<void>;
}
