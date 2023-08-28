import type { App } from "electron";
import type { SearchIndex } from "../SearchIndex";
import type { SettingsManager } from "../Settings/SettingsManager";

export type PluginDependencies = {
    searchIndex: SearchIndex;
    settingsManager: SettingsManager;
    app: App;
    pluginCacheFolderPath: string;
};
