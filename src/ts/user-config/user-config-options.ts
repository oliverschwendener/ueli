import { WebSearch } from "./../web-search";
import { Shortcut } from "./../shortcut";
import { FileSearchOption } from "./../file-search-option";
import { CustomCommand } from "./../custom-shortcut";
import { IconSet } from "../icon-sets/icon-set";

export interface UserConfigOptions {
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
    iconSet: IconSet;
    logExecution: boolean;
    maxSearchResultCount: number;
    maxWindowHeight: number;
    rescanInterval: number;
    searchEngineThreshold: number;
    searchEnvironmentVariables: boolean;
    searchOperatingSystemCommands: boolean;
    searchOperatingSystemSettings: boolean;
    searchResultDescriptionFontSize: number;
    searchResultHeight: number;
    searchResultNameFontSize: number;
    shortcuts: Shortcut[];
    showTrayIcon: boolean;
    userInputFontSize: number;
    userInputHeight: number;
    userStylesheet: string;
    webSearches: WebSearch[];
    windowWidth: number;
}
