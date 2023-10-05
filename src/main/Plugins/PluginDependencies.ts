import type { OperatingSystem } from "@common/OperatingSystem";
import type { App, NativeTheme } from "electron";
import type { EventSubscriber } from "../EventSubscriber";
import type { SearchIndex } from "../SearchIndex";
import type { SettingsManager } from "../Settings";
import type { CommandlineUtility, FileSystemUtility } from "../Utilities";

export type PluginDependencies = {
    readonly app: App;
    readonly commandlineUtility: CommandlineUtility;
    readonly currentOperatingSystem: OperatingSystem;
    readonly eventSubscriber: EventSubscriber;
    readonly fileSystemUtility: FileSystemUtility;
    readonly nativeTheme: NativeTheme;
    readonly pluginCacheFolderPath: string;
    readonly searchIndex: SearchIndex;
    readonly settingsManager: SettingsManager;
};
