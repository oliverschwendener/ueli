import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { CommandPrompLauncher } from "./CommandPromptLauncher";
import { ItermLauncher } from "./ItermLauncher";
import { LaunchTerminalActionHandler } from "./LaunchTerminalActionHandler";
import { MacOsTerminalLauncher } from "./MacOsTerminalLauncher";
import { PowershellCoreTerminalLauncher } from "./PowershellCoreTerminalLauncher";
import { PowershellTerminalLauncher } from "./PowershellTerminalLauncher";
import { TerminalLauncherExtension } from "./TerminalLauncherExtension";
import { WslTerminalLauncher } from "./WslTerminalLauncher";

export class TerminalLauncherModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        return {
            extension: new TerminalLauncherExtension(
                dependencyRegistry.get("OperatingSystem"),
                dependencyRegistry.get("AssetPathResolver"),
                dependencyRegistry.get("SettingsManager"),
                dependencyRegistry.get("Translator"),
            ),
            actionHandlers: [
                new LaunchTerminalActionHandler([
                    new MacOsTerminalLauncher(dependencyRegistry.get("AppleScriptUtility")),
                    new ItermLauncher(dependencyRegistry.get("AppleScriptUtility")),
                    new CommandPrompLauncher(dependencyRegistry.get("CommandlineUtility")),
                    new PowershellTerminalLauncher(dependencyRegistry.get("CommandlineUtility")),
                    new PowershellCoreTerminalLauncher(dependencyRegistry.get("CommandlineUtility")),
                    new WslTerminalLauncher(dependencyRegistry.get("CommandlineUtility")),
                ]),
            ],
        };
    }
}
