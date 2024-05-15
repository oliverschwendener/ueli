import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { ItermLauncher } from "./ItermLauncher";
import { LaunchTerminalActionHandler } from "./LaunchTerminalActionHandler";
import { MacOsTerminalLauncher } from "./MacOsTerminalLauncher";
import { TerminalLauncherExtension } from "./TerminalLauncherExtension";

export class TerminalLauncherModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        return {
            extension: new TerminalLauncherExtension(
                dependencyRegistry.get("OperatingSystem"),
                dependencyRegistry.get("AssetPathResolver"),
                dependencyRegistry.get("SettingsManager"),
            ),
            actionHandlers: [
                new LaunchTerminalActionHandler([
                    new MacOsTerminalLauncher(dependencyRegistry.get("AppleScriptUtility")),
                    new ItermLauncher(dependencyRegistry.get("AppleScriptUtility")),
                ]),
            ],
        };
    }
}
