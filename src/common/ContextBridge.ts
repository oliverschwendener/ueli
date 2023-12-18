import type { ExtensionInfo } from "./ExtensionInfo";
import type { SearchResultItem } from "./SearchResultItem";
import type { SearchResultItemAction } from "./SearchResultItemAction";

export type ContextBridge = {
    extensionDisabled: (extensionId: string) => void;
    extensionEnabled: (extensionId: string) => void;
    getAccentColor: () => string;
    getSearchResultItems: () => SearchResultItem[];
    getSettingByKey: <T>(key: string, defaultValue: T) => T;
    getSupportedExtensions: () => ExtensionInfo[];
    invokeAction: (action: SearchResultItemAction) => Promise<void>;
    onNativeThemeChanged: (callback: () => void) => void;
    onSearchIndexUpdated: (callback: () => void) => void;
    onOpenSettings: (callback: () => void) => void;
    onOpenAbout: (callback: () => void) => void;
    themeShouldUseDarkColors: () => boolean;
    updateSettingByKey: <T>(key: string, value: T) => Promise<void>;
    windowFocused: (callback: () => void) => void;
};
