import type { App } from "electron";
import type { CommandlineUtility } from "../../CommandlineUtility";
import type { DependencyInjector } from "../../DependencyInjector";
import type { FileSystemUtility } from "../../FileSystemUtility";
import type { OperatingSystem } from "../../OperatingSystem";
import type { PluginCacheFolder } from "../../PluginCacheFolder";
import type { SettingsManager } from "../../SettingsManager";
import { ApplicationSearch } from "./ApplicationSearch";
import { WindowsApplicationRepository } from "./Windows/WindowsApplicationRepository";
import { MacOsApplicationIconGenerator } from "./macOS/MacOsApplicationIconGenerator";
import { MacOsApplicationRepository } from "./macOS/MacOsApplicationRepository";

export class ApplicationSearchModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const operatingSystem = dependencyInjector.getInstance<OperatingSystem>("OperatingSystem");
        const fileSystemUtility = dependencyInjector.getInstance<FileSystemUtility>("FileSystemUtility");
        const commandlineUtility = dependencyInjector.getInstance<CommandlineUtility>("CommandlineUtility");
        const pluginCacheFolder = dependencyInjector.getInstance<PluginCacheFolder>("PluginCacheFolder");
        const settingsManager = dependencyInjector.getInstance<SettingsManager>("SettingsManager");
        const app = dependencyInjector.getInstance<App>("App");

        const applicationRepository = {
            macOS: new MacOsApplicationRepository(
                commandlineUtility,
                settingsManager,
                app,
                new MacOsApplicationIconGenerator(fileSystemUtility, commandlineUtility, pluginCacheFolder),
            ),
            Windows: new WindowsApplicationRepository(
                pluginCacheFolder,
                fileSystemUtility,
                commandlineUtility,
                settingsManager,
                app,
            ),
        }[operatingSystem];

        dependencyInjector.registerPlugin(new ApplicationSearch(applicationRepository));
    }
}
