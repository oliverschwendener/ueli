import type { AboutUeli } from "./AboutUeli";
import type { ExtensionInfo } from "./ExtensionInfo";
import type { ExtensionSettingsStructure } from "./ExtensionSettingsStructure";
import type { OperatingSystem } from "./OperatingSystem";
import type { SearchResultItem } from "./SearchResultItem";
import type { SearchResultItemAction } from "./SearchResultItemAction";

export type ContextBridge = {
    extensionDisabled: (extensionId: string) => void;
    extensionEnabled: (extensionId: string) => void;
    getAboutUeli: () => AboutUeli;
    getLogs: () => string[];
    getSearchResultItems: () => SearchResultItem[];
    getSettingByKey: <T>(key: string, defaultValue: T) => T;
    getAvailableExtensions: () => ExtensionInfo[];
    getExtensionSettingsStructure: (extensionId: string) => ExtensionSettingsStructure;
    getOperatingSystem: () => OperatingSystem;
    invokeAction: (action: SearchResultItemAction) => Promise<void>;
    onNativeThemeChanged: (callback: () => void) => void;
    onSearchIndexUpdated: (callback: () => void) => void;
    onOpenSettings: (callback: () => void) => void;
    onOpenAbout: (callback: () => void) => void;
    themeShouldUseDarkColors: () => boolean;
    updateSettingByKey: <T>(key: string, value: T) => Promise<void>;
    windowFocused: (callback: () => void) => void;
};
