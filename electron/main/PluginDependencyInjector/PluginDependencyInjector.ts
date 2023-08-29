import type { OperatingSystem } from "@common/OperatingSystem";
import type { App } from "electron";
import type { SearchIndex } from "../SearchIndex";
import type { SettingsManager } from "../Settings/SettingsManager";
import type { CommandlineUtility, FileSystemUtility, PowershellUtility } from "../Utilities";

export class PluginDependencyInjector {
    public constructor(
        public readonly app: App,
        public readonly commandlineUtility: CommandlineUtility,
        public readonly fileSystemUtility: FileSystemUtility,
        public readonly operatingSystem: OperatingSystem,
        public readonly pluginCacheFolderPath: string,
        public readonly powershellUtility: PowershellUtility,
        public readonly searchIndex: SearchIndex,
        public readonly settingsManager: SettingsManager,
    ) {}
}
