export interface FileSearcher {
    getFilePathsBySearchTerm(searchTerm: string, maxSearchResultCount: number): Promise<string[]>;
}
