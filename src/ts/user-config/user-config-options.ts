import { WebSearch } from "../web-search";
import { Shortcut } from "../shortcut";
import { FileSearchOption } from "../file-search-option";
import { CustomCommand } from "../custom-shortcut";
import { IconSet } from "../icon-sets/icon-set";
import { FeatureOptions } from "./feature-options";

export interface UserConfigOptions {
    allowMouseInteraction: boolean;
    alwaysShowOnPrimaryDisplay: boolean;
    applicationFileExtensions: string[];
    applicationFolders: string[];
    autoStartApp: boolean;
    colorTheme: string;
    customCommands: CustomCommand[];
    fallbackWebSearches: string[];
    features: FeatureOptions;
    fileSearchBlackList: string[];
    fileSearchOptions: FileSearchOption[];
    hotKey: string;
    iconSet: IconSet;
    logExecution: boolean;
    maxSearchResultCount: number;
    rescanInterval: number;
    searchEngineLimit: number;
    searchEngineThreshold: number;
    searchResultDescriptionFontSize: number;
    searchResultHeight: number;
    searchResultNameFontSize: number;
    shortcuts: Shortcut[];
    showTrayIcon: boolean;
    smoothScrolling: boolean;
    userInputFontSize: number;
    userInputHeight: number;
    userStylesheet: string;
    webSearches: WebSearch[];
    windowMaxHeight: number;
    windowWidth: number;
}
