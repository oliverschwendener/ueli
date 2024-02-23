import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { OperatingSystem } from "@common/Core";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import type { ApplicationRepository } from "./ApplicationRepository";
import { ApplicationSearch } from "./ApplicationSearch";
import { Settings } from "./Settings";
import { WindowsApplicationRepository } from "./Windows/WindowsApplicationRepository";
import { MacOsApplicationRepository } from "./macOS/MacOsApplicationRepository";

export class ApplicationSearchModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        const settings = new Settings(
            "ApplicationSearch",
            dependencyRegistry.get("SettingsManager"),
            dependencyRegistry.get("App"),
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
            Linux: undefined, // not supported
        };

        return {
            extension: new ApplicationSearch(
                dependencyRegistry.get("OperatingSystem"),
                applicationRepositories[dependencyRegistry.get("OperatingSystem")],
                settings,
                dependencyRegistry.get("AssetPathResolver"),
            ),
        };
    }
}
