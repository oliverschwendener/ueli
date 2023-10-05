import type { App, NativeTheme } from "electron";
import type { CommandlineUtility } from "./CommandlineUtility";
import type { EventSubscriber } from "./EventSubscriber";
import type { FileSystemUtility } from "./FileSystemUtility";
import type { OperatingSystem } from "./OperatingSystem";
import type { SettingsManager } from "./SettingsManager";

export type PluginDependencies = {
    readonly app: App;
    readonly commandlineUtility: CommandlineUtility;
    readonly currentOperatingSystem: OperatingSystem;
    readonly eventSubscriber: EventSubscriber;
    readonly fileSystemUtility: FileSystemUtility;
    readonly nativeTheme: NativeTheme;
    readonly pluginCacheFolderPath: string;
    readonly settingsManager: SettingsManager;
};
