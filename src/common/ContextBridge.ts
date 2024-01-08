import type { OpenDialogOptions, OpenDialogReturnValue } from "electron";
import type { AboutUeli } from "./AboutUeli";
import type { ExtensionInfo } from "./ExtensionInfo";
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
    getOperatingSystem: () => OperatingSystem;
    getExtensionSettingDefaultValue: <T>(extensionId: string, settingKey: string) => T;
    invokeAction: (action: SearchResultItemAction) => Promise<void>;
    onNativeThemeChanged: (callback: () => void) => void;
    onSearchIndexUpdated: (callback: () => void) => void;
    onNavigateTo: (callback: (pathname: string) => void) => void;
    showOpenDialog: (options: OpenDialogOptions) => Promise<OpenDialogReturnValue>;
    themeShouldUseDarkColors: () => boolean;
    updateSettingByKey: <T>(key: string, value: T) => Promise<void>;
    windowFocused: (callback: () => void) => void;
};
