import { WebSearch } from "./web-search";
import { CustomCommand } from "./custom-command";
import { FileSearchOption } from "./file-search-option";

export interface ConfigOptions {
    allowMouseInteraction: boolean;
    alwaysShowOnPrimaryDisplay: boolean;
    applicationFileExtensions: string[];
    applicationFolders: string[];
    autoStartApp: boolean;
    colorTheme: string;
    customCommands: CustomCommand[];
    fallbackWebSearches: string[];
    fileSearchOptions: FileSearchOption[];
    hotKey: string;
    logExecution: boolean;
    maxSearchResultCount: number;
    rescanInterval: number;
    searchEngineThreshold: number;
    searchEnvironmentVariables: boolean;
    searchOperatingSystemSettings: boolean;
    searchResultDescriptionFontSize: number;
    searchResultHeight: number;
    searchResultNameFontSize: number;
    showTrayIcon: boolean;
    userInputHeight: number;
    userInputFontSize: number;
    userStylesheet: string;
    webSearches: WebSearch[];
    windowWith: number;
}
