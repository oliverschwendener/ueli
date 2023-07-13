import { SearchResultItem } from "./SearchResultItem";

export type ContextBridge = {
    onNativeThemeChanged: (callback: () => void) => void;
    onSearchResultItemsUpdated: (callback: (searchResultItems: SearchResultItem[]) => void) => void;
    themeShouldUseDarkColors: () => boolean;
};
