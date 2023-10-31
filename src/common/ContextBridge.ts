import type { ExecutionArgument } from "./ExecutionArgument";
import type { SearchResultItem } from "./SearchResultItem";
import type { UeliPlugin } from "./UeliPlugin";

export type ContextBridge = {
    getSupportedPlugins: () => UeliPlugin[];
    pluginDisabled: (pluginId: string) => void;
    pluginEnabled: (pluginId: string) => void;
    getSearchResultItems: () => SearchResultItem[];
    getSettingByKey: <T>(key: string, defaultValue: T) => T;
    invokeExecution: (executionArgument: ExecutionArgument) => Promise<void>;
    onNativeThemeChanged: (callback: () => void) => void;
    onSearchIndexUpdated: (callback: () => void) => void;
    themeShouldUseDarkColors: () => boolean;
    updateSettingByKey: <T>(key: string, value: T) => Promise<void>;
    windowFocused: (callback: () => void) => void;
};
