import type { ActionHandler } from "@Core/ActionHandler";
import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
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
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        const settings = new Settings(
            "ApplicationSearch",
            moduleRegistry.get("SettingsManager"),
            moduleRegistry.get("App"),
            moduleRegistry.get("EnvironmentVariableProvider"),
        );

        const applicationRepositories: Record<OperatingSystem, () => ApplicationRepository> = {
            macOS: () =>
                new MacOsApplicationRepository(
                    moduleRegistry.get("CommandlineUtility"),
                    moduleRegistry.get("FileImageGenerator"),
                    moduleRegistry.get("Logger"),
                    settings,
                    moduleRegistry.get("AssetPathResolver"),
                ),
            Windows: () =>
                new WindowsApplicationRepository(
                    moduleRegistry.get("PowershellUtility"),
                    settings,
                    moduleRegistry.get("FileSystemUtility"),
                    moduleRegistry.get("FileImageGenerator"),
                    moduleRegistry.get("Logger"),
                    moduleRegistry.get("AssetPathResolver"),
                ),
            Linux: () =>
                new LinuxApplicationRepository(
                    moduleRegistry.get("FileSystemUtility"),
                    moduleRegistry.get("FileImageGenerator"),
                    moduleRegistry.get("IniFileParser"),
                    moduleRegistry.get("EnvironmentVariableProvider"),
                    moduleRegistry.get("AssetPathResolver"),
                    moduleRegistry.get("Logger"),
                    settings,
                ),
        };

        const actionHandlers: Record<OperatingSystem, () => ActionHandler[]> = {
            Linux: () => [new LaunchDesktopFileActionHandler(moduleRegistry.get("CommandlineUtility"))],
            macOS: () => [],
            Windows: () => [new OpenAsAdministrator(moduleRegistry.get("PowershellUtility"))],
        };

        return {
            extension: new ApplicationSearch(
                moduleRegistry.get("OperatingSystem"),
                applicationRepositories[moduleRegistry.get("OperatingSystem")](),
                settings,
                moduleRegistry.get("AssetPathResolver"),
            ),
            actionHandlers: actionHandlers[moduleRegistry.get("OperatingSystem")](),
        };
    }
}
