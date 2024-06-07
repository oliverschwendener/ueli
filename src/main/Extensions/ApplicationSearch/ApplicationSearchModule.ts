import type { ActionHandler } from "@Core/ActionHandler";
import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { OperatingSystem } from "@common/Core";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import type { ApplicationRepository } from "./ApplicationRepository";
import { ApplicationSearch } from "./ApplicationSearch";
import { LaunchDesktopFileActionHandler, LinuxApplicationRepository } from "./Linux";
import { Settings } from "./Settings";
import { OpenAsAdministrator, WindowsApplicationRepository } from "./Windows";
import { MacOsApplicationRepository } from "./macOS";

export class ApplicationSearchModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        const settings = new Settings(
            "ApplicationSearch",
            dependencyRegistry.get("SettingsManager"),
            dependencyRegistry.get("App"),
            dependencyRegistry.get("EnvironmentVariableProvider"),
        );

        const applicationRepositories: Record<OperatingSystem, () => ApplicationRepository> = {
            macOS: () =>
                new MacOsApplicationRepository(
                    dependencyRegistry.get("CommandlineUtility"),
                    dependencyRegistry.get("FileImageGenerator"),
                    dependencyRegistry.get("Logger"),
                    settings,
                    dependencyRegistry.get("AssetPathResolver"),
                ),
            Windows: () =>
                new WindowsApplicationRepository(
                    dependencyRegistry.get("PowershellUtility"),
                    settings,
                    dependencyRegistry.get("FileImageGenerator"),
                    dependencyRegistry.get("Logger"),
                    dependencyRegistry.get("AssetPathResolver"),
                ),
            Linux: () =>
                new LinuxApplicationRepository(
                    dependencyRegistry.get("FileSystemUtility"),
                    dependencyRegistry.get("FileImageGenerator"),
                    dependencyRegistry.get("IniFileParser"),
                    dependencyRegistry.get("EnvironmentVariableProvider"),
                    dependencyRegistry.get("AssetPathResolver"),
                    dependencyRegistry.get("Logger"),
                    settings,
                ),
        };

        const actionHandlers: Record<OperatingSystem, () => ActionHandler[]> = {
            Linux: () => [
                new LaunchDesktopFileActionHandler(
                    dependencyRegistry.get("CommandlineUtility"),
                ),
            ],
            macOS: () => [],
            Windows: () => [new OpenAsAdministrator(dependencyRegistry.get("PowershellUtility"))],
        };

        return {
            extension: new ApplicationSearch(
                dependencyRegistry.get("OperatingSystem"),
                applicationRepositories[dependencyRegistry.get("OperatingSystem")](),
                settings,
                dependencyRegistry.get("AssetPathResolver"),
                dependencyRegistry.get("EnvironmentVariableProvider"),
            ),
            actionHandlers: actionHandlers[dependencyRegistry.get("OperatingSystem")](),
        };
    }
}
