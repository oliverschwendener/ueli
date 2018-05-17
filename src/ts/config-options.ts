import { WebSearch } from "./web-search";

export interface ConfigOptions {
    applicationFileExtensions: string[];
    applicationFolders: string[];
    autoStartApp: boolean;
    colorTheme: string;
    maxSearchResultCount: number;
    rescanInterval: number;
    searchEngineThreshold: number;
    searchOperatingSystemSettings: boolean;
    searchResultExecutionArgumentFontSize: number;
    searchResultHeight: number;
    searchResultNameFontSize: number;
    userInputHeight: number;
    userInputFontSize: number;
    webSearches: WebSearch[];
    windowWith: number;
}
