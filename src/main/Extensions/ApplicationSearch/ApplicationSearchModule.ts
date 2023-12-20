import type { OperatingSystem } from "@common/OperatingSystem";
import type { App } from "electron";
import type { CommandlineUtility } from "../../CommandlineUtility";
import type { DependencyInjector } from "../../DependencyInjector";
import type { ExtensionCacheFolder } from "../../ExtensionCacheFolder";
import type { FileSystemUtility } from "../../FileSystemUtility";
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
        const extensionCacheFolder = dependencyInjector.getInstance<ExtensionCacheFolder>("ExtensionCacheFolder");
        const settingsManager = dependencyInjector.getInstance<SettingsManager>("SettingsManager");
        const app = dependencyInjector.getInstance<App>("App");

        const applicationRepository = {
            macOS: new MacOsApplicationRepository(
                app,
                commandlineUtility,
                new MacOsApplicationIconGenerator(fileSystemUtility, commandlineUtility, extensionCacheFolder),
                settingsManager,
            ),
            Windows: new WindowsApplicationRepository(
                app,
                commandlineUtility,
                extensionCacheFolder,
                fileSystemUtility,
                settingsManager,
            ),
        }[operatingSystem];

        dependencyInjector.registerExtension(new ApplicationSearch(applicationRepository));
    }
}
