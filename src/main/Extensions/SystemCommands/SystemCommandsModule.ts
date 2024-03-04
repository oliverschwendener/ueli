import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { OperatingSystem } from "@common/Core";
import type { Translations } from "@common/Core/Extension";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { SystemCommands } from "./SystemCommands";
import { MacOsSystemCommandActionHandler, MacOsSystemCommandRepository, macOsTranslations } from "./macOS";

export class SystemCommandsModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        const translations: Record<OperatingSystem, Translations> = {
            Linux: {}, // not supported,
            macOS: macOsTranslations,
            Windows: {}, // not supported
        };

        return {
            extension: new SystemCommands(
                dependencyRegistry.get("OperatingSystem"),
                new MacOsSystemCommandRepository(
                    dependencyRegistry.get("Translator"),
                    dependencyRegistry.get("AssetPathResolver"),
                ),
                translations[dependencyRegistry.get("OperatingSystem")],
            ),
            actionHandlers: [new MacOsSystemCommandActionHandler(dependencyRegistry.get("CommandlineUtility"))],
        };
    }
}
