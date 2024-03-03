import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { OperatingSystem } from "@common/Core";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import type { ApplicationRepository } from "./ApplicationRepository";
import { ApplicationSearch } from "./ApplicationSearch";
import { LinuxApplicationIconGenerator } from "./Linux/LinuxApplicationIconGenerator";
import { LinuxApplicationRepository } from "./Linux/LinuxApplicationRepository";
import { Settings } from "./Settings";
import { WindowsApplicationRepository } from "./Windows/WindowsApplicationRepository";
import { MacOsApplicationRepository } from "./macOS/MacOsApplicationRepository";

export class ApplicationSearchModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        const operatingSystem = dependencyRegistry.get("OperatingSystem");
        const settingsManager = dependencyRegistry.get("SettingsManager");
        const app = dependencyRegistry.get("App");
        const assetPathResolver = dependencyRegistry.get("AssetPathResolver");

        const settings = new Settings("ApplicationSearch", settingsManager, app);

        const applicationRepositories: Record<OperatingSystem, ApplicationRepository> = {
            macOS: new MacOsApplicationRepository(
                dependencyRegistry.get("CommandlineUtility"),
                dependencyRegistry.get("FileImageGenerator"),
                dependencyRegistry.get("Logger"),
                settings,
                dependencyRegistry.get("AssetPathResolver"),
            ),
            Windows: new WindowsApplicationRepository(
                dependencyRegistry.get("PowershellUtility"),
                settings,
                dependencyRegistry.get("FileImageGenerator"),
                dependencyRegistry.get("Logger"),
                dependencyRegistry.get("AssetPathResolver"),
            ),
            Linux: new LinuxApplicationRepository(
                dependencyRegistry.get("CommandlineUtility"),
                dependencyRegistry.get("FileSystemUtility"),
                new LinuxApplicationIconGenerator(
                    dependencyRegistry.get("FileSystemUtility"),
                    dependencyRegistry.get("CommandlineUtility"),
                    dependencyRegistry.get("Logger"),
                    dependencyRegistry.get("AssetPathResolver"),
                ),
                dependencyRegistry.get("Logger"),
                settings,
            ),
        };

        return {
            extension: new ApplicationSearch(
                operatingSystem,
                applicationRepositories[operatingSystem],
                settings,
                assetPathResolver,
            ),
        };
    }
}
