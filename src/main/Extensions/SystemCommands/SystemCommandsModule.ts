import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
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
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        const resources: Record<OperatingSystem, Resources<Translations>> = {
            Linux: linuxResources,
            macOS: macOsResources,
            Windows: windowsResources,
        };

        const repositories: Record<OperatingSystem, SystemCommandRepository> = {
            Linux: new LinuxSystemCommandRepository(
                moduleRegistry.get("Translator"),
                moduleRegistry.get("AssetPathResolver"),
                moduleRegistry.get("CommandlineUtility"),
                linuxResources,
            ),
            macOS: new MacOsSystemCommandRepository(
                moduleRegistry.get("Translator"),
                moduleRegistry.get("AssetPathResolver"),
                moduleRegistry.get("AppleScriptUtility"),
                macOsResources,
            ),
            Windows: new WindowsSystemCommandRepository(
                moduleRegistry.get("Translator"),
                moduleRegistry.get("AssetPathResolver"),
                moduleRegistry.get("CommandlineUtility"),
                moduleRegistry.get("PowershellUtility"),
                windowsResources,
            ),
        };

        return {
            extension: new SystemCommands(
                moduleRegistry.get("OperatingSystem"),
                repositories[moduleRegistry.get("OperatingSystem")],
                resources[moduleRegistry.get("OperatingSystem")],
                moduleRegistry.get("AssetPathResolver"),
            ),
            actionHandlers: [new SystemCommandActionHandler(repositories[moduleRegistry.get("OperatingSystem")])],
        };
    }
}
