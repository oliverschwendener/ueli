import type { IpcRenderer, OpenDialogOptions, OpenDialogReturnValue, OpenExternalOptions } from "electron";
import type { AboutUeli } from "./AboutUeli";
import { Translations } from "./Extension";
import type { ExtensionInfo } from "./ExtensionInfo";
import type { OperatingSystem } from "./OperatingSystem";
import type { SearchResultItem } from "./SearchResultItem";
import type { SearchResultItemAction } from "./SearchResultItemAction";

export type ContextBridge = {
    ipcRenderer: {
        on: IpcRenderer["on"];
    };

    copyTextToClipboard: (textToCopy: string) => void;
    extensionDisabled: (extensionId: string) => void;
    extensionEnabled: (extensionId: string) => void;
    fileExists: (filePath: string) => boolean;
    getAboutUeli: () => AboutUeli;
    getAvailableExtensions: () => ExtensionInfo[];
    getEnabledExtensions: () => ExtensionInfo[];
    getExtension: (extensionId: string) => ExtensionInfo;
    getExtensionTranslations: () => { extensionId: string; translations: Translations }[];
    getExcludedSearchResultItemIds: () => string[];
    getExtensionAssetFilePath: (extensionId: string, key: string) => string;
    getExtensionSettingDefaultValue: <Value>(extensionId: string, settingKey: string) => Value;
    getFavorites: () => string[];
    getLogs: () => string[];
    getInstantSearchResultItems: (searchTerm: string) => SearchResultItem[];
    getOperatingSystem: () => OperatingSystem;
    getSearchResultItems: () => SearchResultItem[];
    getSettingValue: <Value>(key: string, defaultValue: Value, isSensitive?: boolean) => Value;
    invokeAction: (action: SearchResultItemAction) => Promise<void>;
    invokeExtension: <Argument, Result>(extensionId: string, searchArguments: Argument) => Promise<Result>;
    openExternal: (url: string, options?: OpenExternalOptions) => Promise<void>;
    removeExcludedSearchResultItem: (itemId: string) => Promise<void>;
    removeFavorite: (id: string) => Promise<void>;
    resetAllSettings: () => Promise<void>;
    showOpenDialog: (options: OpenDialogOptions) => Promise<OpenDialogReturnValue>;
    themeShouldUseDarkColors: () => boolean;
    triggerExtensionRescan: (extensionId: string) => Promise<void>;
    updateSettingValue: <Value>(key: string, value: Value, isSensitive?: boolean) => Promise<void>;
};
