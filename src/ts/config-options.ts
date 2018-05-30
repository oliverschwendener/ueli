import { WebSearch } from "./web-search";
import { CustomCommand } from "./custom-command";

export interface ConfigOptions {
    applicationFileExtensions: string[];
    applicationFolders: string[];
    autoStartApp: boolean;
    colorTheme: string;
    customCommands: CustomCommand[];
    fileSearchFolders: string[];
    hotKey: string;
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
