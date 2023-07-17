import { SearchResultItem } from "./SearchResultItem";

export type ContextBridge = {
    onNativeThemeChanged: (callback: () => void) => void;
    getSearchResultItems: () => SearchResultItem[];
    onSearchResultItemsUpdated: (callback: (searchResultItems: SearchResultItem[]) => void) => void;
    themeShouldUseDarkColors: () => boolean;
};
