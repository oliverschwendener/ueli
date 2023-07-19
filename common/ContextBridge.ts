import { RescanSate } from "./RescanState";
import { SearchResultItem } from "./SearchResultItem";

export type ContextBridge = {
    getRescanState: () => RescanSate;
    getSearchResultItems: () => SearchResultItem[];
    onNativeThemeChanged: (callback: () => void) => void;
    onSearchIndexUpdated: (callback: () => void) => void;
    onRescanStateChanged: (callback: (rescanState: RescanSate) => void) => void;
    themeShouldUseDarkColors: () => boolean;
};
