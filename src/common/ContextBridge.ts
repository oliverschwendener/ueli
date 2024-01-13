import type { IpcRenderer, OpenDialogOptions, OpenDialogReturnValue } from "electron";
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
    getLogs: () => string[];
    getSearchResultItems: () => SearchResultItem[];
    getSettingByKey: <T>(key: string, defaultValue: T) => T;
    getAvailableExtensions: () => ExtensionInfo[];
    getOperatingSystem: () => OperatingSystem;
    getExtensionSettingByKey: <T>(extensionId: string, key: string, defaultValue: T) => T;
    getExtensionSettingDefaultValue: <T>(extensionId: string, settingKey: string) => T;
    getExtensionImageUrl: (extensionId: string) => string | undefined;
    invokeAction: (action: SearchResultItemAction) => Promise<void>;
    invokeExtension: <ArgumentType, ReturnType>(
        extensionId: string,
        searchArguments: ArgumentType,
    ) => Promise<ReturnType>;
    showOpenDialog: (options: OpenDialogOptions) => Promise<OpenDialogReturnValue>;
    themeShouldUseDarkColors: () => boolean;
    updateSettingByKey: <T>(key: string, value: T) => Promise<void>;
    updateExtensionSettingByKey: <T>(extensionId: string, key: string, value: T) => Promise<void>;
};
