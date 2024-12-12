import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { OperatingSystem } from "@common/Core";
import type { Terminal } from "@common/Core/Terminal";
import type { Terminal as TerminalContract } from "./Contract";
import { TerminalRegistry } from "./TerminalRegistry";
import { CommandPrompt, Iterm, MacOsTerminal, Powershell, PowershellCore, Wsl } from "./Terminals";

export class TerminalModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const ipcMain = dependencyRegistry.get("IpcMain");
        const assetPathResolver = dependencyRegistry.get("AssetPathResolver");

        const terminals: Record<OperatingSystem, () => TerminalContract[]> = {
            Linux: () => [],
            macOS: () => [
                new MacOsTerminal(dependencyRegistry.get("AppleScriptUtility")),
                new Iterm(dependencyRegistry.get("AppleScriptUtility")),
            ],
            Windows: () => [
                new CommandPrompt(dependencyRegistry.get("CommandlineUtility")),
                new Powershell(dependencyRegistry.get("CommandlineUtility")),
                new PowershellCore(dependencyRegistry.get("CommandlineUtility")),
                new Wsl(dependencyRegistry.get("CommandlineUtility")),
            ],
        };

        const terminalRegistry = new TerminalRegistry(terminals[dependencyRegistry.get("OperatingSystem")]());

        dependencyRegistry.register("TerminalRegistry", terminalRegistry);

        ipcMain.on(
            "getAvailableTerminals",
            (event) =>
                (event.returnValue = terminalRegistry.getAll().map(
                    ({ terminalId, getAssetFileName, getTerminalName }): Terminal => ({
                        id: terminalId,
                        name: getTerminalName(),
                        assetFilePath: assetPathResolver.getModuleAssetPath("Terminal", getAssetFileName()),
                    }),
                )),
        );
    }
}
