import { RescanSate } from "./RescanState";
import { SearchResultItem } from "./SearchResultItem";

export type ContextBridge = {
    getRescanState: () => RescanSate;
    getSearchResultItems: () => SearchResultItem[];
    onNativeThemeChanged: (callback: () => void) => void;
    onSearchIndexUpdated: (callback: () => void) => void;
    onRescanStateChanged: (callback: (rescanState: RescanSate) => void) => void;
    getSettingByKey: <T>(key: string, defaultValue: T) => T;
    updateSettingByKey: <T>(key: string, value: T) => Promise<void>;
    themeShouldUseDarkColors: () => boolean;
};
