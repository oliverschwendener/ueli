import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { OperatingSystem } from "@common/Core";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import type { ApplicationRepository } from "./ApplicationRepository";
import { ApplicationSearch } from "./ApplicationSearch";
import { GtkLaunchActionHandler } from "./Linux/GtkLaunchActionHandler";
import { LinuxApplicationRepository } from "./Linux/LinuxApplicationRepository";
import { Settings } from "./Settings";
import { WindowsApplicationRepository } from "./Windows/WindowsApplicationRepository";
import { MacOsApplicationRepository } from "./macOS/MacOsApplicationRepository";

export class ApplicationSearchModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        const settings = new Settings(
            "ApplicationSearch",
            dependencyRegistry.get("SettingsManager"),
            dependencyRegistry.get("App"),
            dependencyRegistry.get("EnvironmentVariableProvider"),
        );

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
                dependencyRegistry.get("FileSystemUtility"),
                dependencyRegistry.get("FileImageGenerator"),
                dependencyRegistry.get("IniFileParser"),
                dependencyRegistry.get("EnvironmentVariableProvider"),
                dependencyRegistry.get("AssetPathResolver"),
                dependencyRegistry.get("Logger"),
                settings,
            ),
        };

        return {
            extension: new ApplicationSearch(
                dependencyRegistry.get("OperatingSystem"),
                applicationRepositories[dependencyRegistry.get("OperatingSystem")],
                settings,
                dependencyRegistry.get("AssetPathResolver"),
                dependencyRegistry.get("EnvironmentVariableProvider"),
            ),
            actionHandlers:
                dependencyRegistry.get("OperatingSystem") === "Linux"
                    ? [new GtkLaunchActionHandler(dependencyRegistry.get("CommandlineUtility"))]
                    : [],
        };
    }
}
