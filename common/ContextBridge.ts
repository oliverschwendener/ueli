import type { ExecutionArgument } from "./ExecutionArgument";
import type { SearchResultItem } from "./SearchResultItem";

export type ContextBridge = {
    getSearchResultItems: () => SearchResultItem[];
    getSettingByKey: <T>(key: string, defaultValue: T) => T;
    invokeExecution: (executionArgument: ExecutionArgument) => Promise<void>;
    onNativeThemeChanged: (callback: () => void) => void;
    onSearchIndexUpdated: (callback: () => void) => void;
    themeShouldUseDarkColors: () => boolean;
    updateSettingByKey: <T>(key: string, value: T) => Promise<void>;
};
