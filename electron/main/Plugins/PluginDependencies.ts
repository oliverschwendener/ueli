import type { OperatingSystem } from "@common/OperatingSystem";
import type { App } from "electron";
import type { SearchIndex } from "../SearchIndex";
import type { SettingsManager } from "../Settings/SettingsManager";
import type { CommandlineUtility, FileSystemUtility, PowershellUtility } from "../Utilities";

export type PluginDependencies = {
    app: App;
    commandlineUtility: CommandlineUtility;
    fileSystemUtility: FileSystemUtility;
    operatingSystem: OperatingSystem;
    pluginCacheFolderPath: string;
    powershellUtility: PowershellUtility;
    searchIndex: SearchIndex;
    settingsManager: SettingsManager;
};
