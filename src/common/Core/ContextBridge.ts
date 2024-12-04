import type { IpcRenderer, OpenDialogOptions, OpenDialogReturnValue, OpenExternalOptions } from "electron";
import type { AboutUeli } from "./AboutUeli";
import type { ExtensionInfo } from "./ExtensionInfo";
import type { InstantSearchResultItems } from "./InstantSearchResultItems";
import type { OperatingSystem } from "./OperatingSystem";
import type { SearchResultItem } from "./SearchResultItem";
import type { SearchResultItemAction } from "./SearchResultItemAction";
import type { Terminal } from "./Terminal";
import type { Resources, Translations } from "./Translator";

/**
 * Represents the context bridge that is used to expose Electron APIs to the renderer process.
 */
export type ContextBridge = {
    ipcRenderer: {
        on: IpcRenderer["on"];
        off: IpcRenderer["off"];
        send: IpcRenderer["send"];
    };

    autostartIsEnabled: () => boolean;
    autostartSettingsChanged: (autostartIsEnabled: boolean) => void;
    copyTextToClipboard: (textToCopy: string) => void;
    extensionDisabled: (extensionId: string) => void;
    extensionEnabled: (extensionId: string) => void;
    fileExists: (filePath: string) => boolean;
    getAboutUeli: () => AboutUeli;
    getAvailableExtensions: () => ExtensionInfo[];
    getAvailableTerminals: () => Terminal[];
    getEnabledExtensions: () => ExtensionInfo[];
    getExtension: (extensionId: string) => ExtensionInfo;
    getExtensionResources: <T extends Translations>() => { extensionId: string; resources: Resources<T> }[];
    getExcludedSearchResultItemIds: () => string[];
    getExtensionAssetFilePath: (extensionId: string, key: string) => string;
    getExtensionSettingDefaultValue: <Value>(extensionId: string, settingKey: string) => Value;
    getFavorites: () => string[];
    getLogs: () => string[];
    getInstantSearchResultItems: (searchTerm: string) => InstantSearchResultItems;
    getOperatingSystem: () => OperatingSystem;
    getSearchResultItems: () => SearchResultItem[];
    getSettingValue: <Value>(key: string, defaultValue: Value, isSensitive?: boolean) => Value;
    getScanCount: () => number;
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
