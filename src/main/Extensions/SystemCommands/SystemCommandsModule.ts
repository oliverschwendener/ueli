import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { OperatingSystem } from "@common/Core";
import type { Resources, Translations } from "@common/Core/Translator";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { LinuxSystemCommandRepository, linuxResources } from "./Linux";
import { SystemCommandActionHandler } from "./SystemCommandActionHandler";
import type { SystemCommandRepository } from "./SystemCommandRepository";
import { SystemCommands } from "./SystemCommands";
import { WindowsSystemCommandRepository, windowsResources } from "./Windows";
import { MacOsSystemCommandRepository, macOsResources } from "./macOS";

export class SystemCommandsModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        const resources: Record<OperatingSystem, Resources<Translations>> = {
            Linux: linuxResources,
            macOS: macOsResources,
            Windows: windowsResources,
        };

        const repositories: Record<OperatingSystem, SystemCommandRepository> = {
            Linux: new LinuxSystemCommandRepository(
                dependencyRegistry.get("Translator"),
                dependencyRegistry.get("AssetPathResolver"),
                dependencyRegistry.get("CommandlineUtility"),
                linuxResources,
            ),
            macOS: new MacOsSystemCommandRepository(
                dependencyRegistry.get("Translator"),
                dependencyRegistry.get("AssetPathResolver"),
                dependencyRegistry.get("AppleScriptUtility"),
                macOsResources,
            ),
            Windows: new WindowsSystemCommandRepository(
                dependencyRegistry.get("Translator"),
                dependencyRegistry.get("AssetPathResolver"),
                dependencyRegistry.get("CommandlineUtility"),
                dependencyRegistry.get("PowershellUtility"),
                windowsResources,
            ),
        };

        return {
            extension: new SystemCommands(
                dependencyRegistry.get("OperatingSystem"),
                repositories[dependencyRegistry.get("OperatingSystem")],
                resources[dependencyRegistry.get("OperatingSystem")],
                dependencyRegistry.get("AssetPathResolver"),
            ),
            actionHandlers: [new SystemCommandActionHandler(repositories[dependencyRegistry.get("OperatingSystem")])],
        };
    }
}
