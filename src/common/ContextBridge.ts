import type { SearchResultItem } from "./SearchResultItem";
import type { SearchResultItemAction } from "./SearchResultItemAction";
import type { UeliPlugin } from "./UeliPlugin";

export type ContextBridge = {
    getSupportedPlugins: () => UeliPlugin[];
    pluginDisabled: (pluginId: string) => void;
    pluginEnabled: (pluginId: string) => void;
    getSearchResultItems: () => SearchResultItem[];
    getSettingByKey: <T>(key: string, defaultValue: T) => T;
    invokeAction: (action: SearchResultItemAction) => Promise<void>;
    onNativeThemeChanged: (callback: () => void) => void;
    onSearchIndexUpdated: (callback: () => void) => void;
    themeShouldUseDarkColors: () => boolean;
    updateSettingByKey: <T>(key: string, value: T) => Promise<void>;
    windowFocused: (callback: () => void) => void;
};
