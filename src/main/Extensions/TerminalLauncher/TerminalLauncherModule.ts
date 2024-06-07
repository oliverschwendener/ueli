import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { LaunchTerminalActionHandler } from "./LaunchTerminalActionHandler";
import { TerminalLauncherExtension } from "./TerminalLauncherExtension";

export class TerminalLauncherModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        return {
            extension: new TerminalLauncherExtension(
                dependencyRegistry.get("OperatingSystem"),
                dependencyRegistry.get("AssetPathResolver"),
                dependencyRegistry.get("SettingsManager"),
                dependencyRegistry.get("Translator"),
                dependencyRegistry.get("TerminalRegistry"),
            ),
            actionHandlers: [new LaunchTerminalActionHandler(dependencyRegistry.get("TerminalRegistry"))],
        };
    }
}
