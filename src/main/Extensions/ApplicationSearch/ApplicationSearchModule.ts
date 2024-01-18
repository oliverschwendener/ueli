import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { OperatingSystem } from "@common/Core";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ApplicationRepository } from "./ApplicationRepository";
import { ApplicationSearch } from "./ApplicationSearch";
import { Settings } from "./Settings";
import { WindowsApplicationRepository } from "./Windows/WindowsApplicationRepository";
import { MacOsApplicationIconGenerator } from "./macOS/MacOsApplicationIconGenerator";
import { MacOsApplicationRepository } from "./macOS/MacOsApplicationRepository";

export class ApplicationSearchModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        const operatingSystem = dependencyRegistry.get("OperatingSystem");
        const fileSystemUtility = dependencyRegistry.get("FileSystemUtility");
        const commandlineUtility = dependencyRegistry.get("CommandlineUtility");
        const powershellUtility = dependencyRegistry.get("PowershellUtility");
        const extensionCacheFolder = dependencyRegistry.get("ExtensionCacheFolder");
        const settingsManager = dependencyRegistry.get("SettingsManager");
        const app = dependencyRegistry.get("App");
        const logger = dependencyRegistry.get("Logger");

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
