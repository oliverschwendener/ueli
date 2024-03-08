import type { ActionHandler } from "@Core/ActionHandler";
import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { OperatingSystem } from "@common/Core";
import type { Translations } from "@common/Core/Extension";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import type { SystemCommandRepository } from "./SystemCommandRepository";
import { SystemCommands } from "./SystemCommands";
import { WindowsSystemCommandRepository, windowsTranslations } from "./Windows";
import { WindowsSystemCommandActionHandler } from "./Windows/WindowsSystemCommandActionHandler";
import { MacOsSystemCommandActionHandler, MacOsSystemCommandRepository, macOsTranslations } from "./macOS";

export class SystemCommandsModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        const translations: Record<OperatingSystem, Translations> = {
            Linux: {}, // not supported,
            macOS: macOsTranslations,
            Windows: windowsTranslations,
        };

        const repositories: Record<OperatingSystem, SystemCommandRepository> = {
            Linux: null, // not supported,
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
                translations[dependencyRegistry.get("OperatingSystem")],
                dependencyRegistry.get("AssetPathResolver"),
            ),
            actionHandlers: actionHandlers[dependencyRegistry.get("OperatingSystem")],
        };
    }
}
