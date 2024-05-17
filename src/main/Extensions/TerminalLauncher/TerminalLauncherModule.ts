import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { OperatingSystem } from "@common/Core";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { CommandPromp } from "./CommandPromp";
import { Iterm } from "./Iterm";
import { LaunchTerminalActionHandler } from "./LaunchTerminalActionHandler";
import { MacOsTerminal } from "./MacOsTerminal";
import { Powershell } from "./Powershell";
import { PowershellCore } from "./PowershellCore";
import { Terminal } from "./Terminal";
import { TerminalLauncherExtension } from "./TerminalLauncherExtension";
import { Wsl } from "./Wsl";

export class TerminalLauncherModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        const terminals: Record<OperatingSystem, () => Terminal[]> = {
            Linux: () => [
                new MacOsTerminal(dependencyRegistry.get("AppleScriptUtility")),
                new Iterm(dependencyRegistry.get("AppleScriptUtility")),
            ],
            macOS: () => [],
            Windows: () => [
                new CommandPromp(dependencyRegistry.get("CommandlineUtility")),
                new Powershell(dependencyRegistry.get("CommandlineUtility")),
                new PowershellCore(dependencyRegistry.get("CommandlineUtility")),
                new Wsl(dependencyRegistry.get("CommandlineUtility")),
            ],
        };

        return {
            extension: new TerminalLauncherExtension(
                dependencyRegistry.get("OperatingSystem"),
                dependencyRegistry.get("AssetPathResolver"),
                dependencyRegistry.get("SettingsManager"),
                dependencyRegistry.get("Translator"),
                terminals[dependencyRegistry.get("OperatingSystem")](),
            ),
            actionHandlers: [new LaunchTerminalActionHandler(terminals[dependencyRegistry.get("OperatingSystem")]())],
        };
    }
}
