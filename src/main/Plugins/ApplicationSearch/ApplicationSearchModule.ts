import type { CommandlineUtility } from "@common/CommandlineUtility";
import type { DependencyInjector } from "@common/DependencyInjector";
import type { FileSystemUtility } from "@common/FileSystemUtility";
import type { OperatingSystem } from "@common/OperatingSystem";
import type { PluginCacheFolder } from "@common/PluginCacheFolder";
import type { SettingsManager } from "@common/SettingsManager";
import type { App } from "electron";
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
