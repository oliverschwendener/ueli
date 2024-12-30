import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { LaunchTerminalActionHandler } from "./LaunchTerminalActionHandler";
import { TerminalLauncherExtension } from "./TerminalLauncherExtension";

export class TerminalLauncherModule implements ExtensionModule {
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        return {
            extension: new TerminalLauncherExtension(
                moduleRegistry.get("OperatingSystem"),
                moduleRegistry.get("AssetPathResolver"),
                moduleRegistry.get("SettingsManager"),
                moduleRegistry.get("Translator"),
                moduleRegistry.get("TerminalRegistry"),
            ),
            actionHandlers: [new LaunchTerminalActionHandler(moduleRegistry.get("TerminalRegistry"))],
        };
    }
}
