import type { DependencyInjector } from "@Core/DependencyInjector";
import type { OperatingSystem } from "@common/Core";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ApplicationRepository } from "./ApplicationRepository";
import { ApplicationSearch } from "./ApplicationSearch";
import { Settings } from "./Settings";
import { WindowsApplicationRepository } from "./Windows/WindowsApplicationRepository";
import { MacOsApplicationIconGenerator } from "./macOS/MacOsApplicationIconGenerator";
import { MacOsApplicationRepository } from "./macOS/MacOsApplicationRepository";

export class ApplicationSearchModule {
    public static bootstrap(dependencyInjector: DependencyInjector): ExtensionBootstrapResult {
        const operatingSystem = dependencyInjector.getInstance("OperatingSystem");
        const fileSystemUtility = dependencyInjector.getInstance("FileSystemUtility");
        const commandlineUtility = dependencyInjector.getInstance("CommandlineUtility");
        const powershellUtility = dependencyInjector.getInstance("PowershellUtility");
        const extensionCacheFolder = dependencyInjector.getInstance("ExtensionCacheFolder");
        const settingsManager = dependencyInjector.getInstance("SettingsManager");
        const app = dependencyInjector.getInstance("App");
        const logger = dependencyInjector.getInstance("Logger");

        const settings = new Settings("ApplicationSearch", settingsManager, app);

        const applicationRepositories: Record<OperatingSystem, ApplicationRepository> = {
            macOS: new MacOsApplicationRepository(
                commandlineUtility,
                new MacOsApplicationIconGenerator(fileSystemUtility, commandlineUtility, extensionCacheFolder),
                logger,
                settings,
            ),
            Windows: new WindowsApplicationRepository(powershellUtility, extensionCacheFolder, settings),
            Linux: undefined, // not supported
        };

        return { extension: new ApplicationSearch(applicationRepositories[operatingSystem], settings) };
    }
}
