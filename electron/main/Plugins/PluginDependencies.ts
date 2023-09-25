import type { OperatingSystem } from "@common/OperatingSystem";
import type { App } from "electron";
import type { EventSubscriber } from "../EventSubscriber";
import type { SearchIndex } from "../SearchIndex";
import type { SettingsManager } from "../Settings";
import type { CommandlineUtility, FileSystemUtility } from "../Utilities";

export type PluginDependencies = {
    readonly app: App;
    readonly commandlineUtility: CommandlineUtility;
    readonly eventSubscriber: EventSubscriber;
    readonly fileSystemUtility: FileSystemUtility;
    readonly currentOperatingSystem: OperatingSystem;
    readonly pluginCacheFolderPath: string;
    readonly searchIndex: SearchIndex;
    readonly settingsManager: SettingsManager;
};
