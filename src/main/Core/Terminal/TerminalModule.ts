import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { TerminalRegistry } from "./TerminalRegistry";
import { CommandPromp, Iterm, MacOsTerminal, Powershell, PowershellCore, Wsl } from "./Terminals";

export class TerminalModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const terminalRegistry = new TerminalRegistry(dependencyRegistry.get("OperatingSystem"), {
            Linux: () => [],
            macOS: () => [
                new MacOsTerminal(dependencyRegistry.get("AppleScriptUtility")),
                new Iterm(dependencyRegistry.get("AppleScriptUtility")),
            ],
            Windows: () => [
                new CommandPromp(dependencyRegistry.get("CommandlineUtility")),
                new Powershell(dependencyRegistry.get("CommandlineUtility")),
                new PowershellCore(dependencyRegistry.get("CommandlineUtility")),
                new Wsl(dependencyRegistry.get("CommandlineUtility")),
            ],
        });

        dependencyRegistry.register("TerminalRegistry", terminalRegistry);
    }
}
