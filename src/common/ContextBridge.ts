import type { IpcRenderer, OpenDialogOptions, OpenDialogReturnValue, OpenExternalOptions } from "electron";
import type { AboutUeli } from "./AboutUeli";
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
    getAboutUeli: () => AboutUeli;
    getAvailableExtensions: () => ExtensionInfo[];
    getExtensionImageUrl: (extensionId: string) => string | undefined;
    getExtensionSettingDefaultValue: <T>(extensionId: string, settingKey: string) => T;
    getLogs: () => string[];
    getOperatingSystem: () => OperatingSystem;
    getSearchResultItems: () => SearchResultItem[];
    getSettingValue: <T>(key: string, defaultValue: T) => T;
    invokeAction: (action: SearchResultItemAction) => Promise<void>;
    invokeExtension: <A, R>(extensionId: string, searchArguments: A) => Promise<R>;
    openExternal: (url: string, options?: OpenExternalOptions) => Promise<void>;
    showOpenDialog: (options: OpenDialogOptions) => Promise<OpenDialogReturnValue>;
    themeShouldUseDarkColors: () => boolean;
    updateSettingValue: <T>(key: string, value: T) => Promise<void>;
};
