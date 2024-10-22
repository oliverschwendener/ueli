import type { ActionHandler } from "@Core/ActionHandler";
import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { OperatingSystem } from "@common/Core";
import type { Resources, Translations } from "@common/Core/Translator";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { LinuxSystemCommandRepository } from "./Linux/LinuxSystemCommandRepository";
import type { SystemCommandRepository } from "./SystemCommandRepository";
import { SystemCommands } from "./SystemCommands";
import { WindowsSystemCommandRepository, windowsResources } from "./Windows";
import { WindowsSystemCommandActionHandler } from "./Windows/WindowsSystemCommandActionHandler";
import { MacOsSystemCommandActionHandler, MacOsSystemCommandRepository, macOsResources } from "./macOS";

export class SystemCommandsModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        const resources: Record<OperatingSystem, Resources<Translations>> = {
            Linux: {}, // not supported,
            macOS: macOsResources,
            Windows: windowsResources,
        };

        const repositories: Record<OperatingSystem, SystemCommandRepository> = {
            Linux: new LinuxSystemCommandRepository(), // not supported
            macOS: new MacOsSystemCommandRepository(
                dependencyRegistry.get("Translator"),
                dependencyRegistry.get("AssetPathResolver"),
            ),
            Windows: new WindowsSystemCommandRepository(
                dependencyRegistry.get("Translator"),
                dependencyRegistry.get("AssetPathResolver"),
            ),
        };

        const actionHandlers: Record<OperatingSystem, ActionHandler[]> = {
            Linux: [], // not supported,
            macOS: [new MacOsSystemCommandActionHandler(dependencyRegistry.get("AppleScriptUtility"))],
            Windows: [new WindowsSystemCommandActionHandler(dependencyRegistry.get("CommandlineUtility"))],
        };

        return {
            extension: new SystemCommands(
                dependencyRegistry.get("OperatingSystem"),
                repositories[dependencyRegistry.get("OperatingSystem")],
                resources[dependencyRegistry.get("OperatingSystem")],
                dependencyRegistry.get("AssetPathResolver"),
            ),
            actionHandlers: actionHandlers[dependencyRegistry.get("OperatingSystem")],
        };
    }
}
