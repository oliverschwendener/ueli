export interface EverythingSearchOptions {
    enabled: boolean;
    pathToEs: string;
    prefix: string;
    maxSearchResults: number;
}

export const defaultEverythingSearchOptions: EverythingSearchOptions = {
    enabled: false,
    maxSearchResults: 24,
    pathToEs: "C:\\es\\es.exe",
    prefix: "es?",
};
