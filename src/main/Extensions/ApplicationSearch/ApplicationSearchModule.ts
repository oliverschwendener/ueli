import type { OperatingSystem } from "@common/OperatingSystem";
import type { App } from "electron";
import type { CommandlineUtility } from "../../CommandlineUtility";
import type { DependencyInjector } from "../../DependencyInjector";
import type { ExtensionCacheFolder } from "../../ExtensionCacheFolder";
import type { FileSystemUtility } from "../../FileSystemUtility";
import type { Logger } from "../../Logger";
import type { SettingsManager } from "../../SettingsManager";
import type { ApplicationRepository } from "./ApplicationRepository";
import { ApplicationSearch } from "./ApplicationSearch";
import { Settings } from "./Settings";
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
        const logger = dependencyInjector.getInstance<Logger>("Logger");

        const settings = new Settings("ApplicationSearch", settingsManager, app);

        const applicationRepositories: Record<OperatingSystem, ApplicationRepository> = {
            macOS: new MacOsApplicationRepository(
                commandlineUtility,
                new MacOsApplicationIconGenerator(fileSystemUtility, commandlineUtility, extensionCacheFolder),
                logger,
                settings,
            ),
            Windows: new WindowsApplicationRepository(
                commandlineUtility,
                extensionCacheFolder,
                fileSystemUtility,
                settings,
            ),
            Linux: undefined, // not supported
        };

        dependencyInjector.registerExtension(new ApplicationSearch(applicationRepositories[operatingSystem], settings));
    }
}
