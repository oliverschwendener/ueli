export interface SearchEngineOptions {
    fuzzyness: number;
    maxSearchResults: number;
}

export const defaultSearchEngineOptions: SearchEngineOptions = {
    fuzzyness: 0.5,
    maxSearchResults: 24,
};
