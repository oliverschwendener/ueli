import { WebSearch } from "./web-search";
import { Shortcut } from "./shortcut";
import { FileSearchOption } from "./file-search-option";
import { CustomCommand } from "./custom-shortcut";

export interface ConfigOptions {
    allowMouseInteraction: boolean;
    alwaysShowOnPrimaryDisplay: boolean;
    applicationFileExtensions: string[];
    applicationFolders: string[];
    autoStartApp: boolean;
    colorTheme: string;
    customCommands: CustomCommand[];
    shortcuts: Shortcut[];
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
    windowWidth: number;
}
