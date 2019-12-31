export interface SearchEngineOptions {
    blackList: string[];
    fuzzyness: number;
    maxSearchResults: number;
}

export const defaultSearchEngineOptions: SearchEngineOptions = {
    blackList: [],
    fuzzyness: 0.5,
    maxSearchResults: 24,
};
