import type { OperatingSystem } from "@common/OperatingSystem";
import type { App } from "electron";
import type { SearchIndex } from "../SearchIndex";
import type { SettingsManager } from "../Settings/SettingsManager";
import type { CommandlineUtility, FileSystemUtility, PowershellUtility } from "../Utilities";

export type PluginDependencies = {
    readonly app: App;
    readonly commandlineUtility: CommandlineUtility;
    readonly fileSystemUtility: FileSystemUtility;
    readonly operatingSystem: OperatingSystem;
    readonly pluginCacheFolderPath: string;
    readonly powershellUtility: PowershellUtility;
    readonly searchIndex: SearchIndex;
    readonly settingsManager: SettingsManager;
};
