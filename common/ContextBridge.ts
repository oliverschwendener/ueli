import { SearchResultItem } from "./SearchResultItem";

export type ContextBridge = {
    getSearchResultItems: () => SearchResultItem[];
    onNativeThemeChanged: (callback: () => void) => void;
    onSearchIndexUpdated: (callback: () => void) => void;
    themeShouldUseDarkColors: () => boolean;
};
