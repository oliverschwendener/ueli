import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { Terminal } from "@common/Core/Terminal";
import { TerminalRegistry } from "./TerminalRegistry";
import { CommandPrompt, Iterm, MacOsTerminal, Powershell, PowershellCore, Wsl } from "./Terminals";

export class TerminalModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const ipcMain = dependencyRegistry.get("IpcMain");
        const assetPathResolver = dependencyRegistry.get("AssetPathResolver");

        const terminalRegistry = new TerminalRegistry(dependencyRegistry.get("OperatingSystem"), {
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
        });

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
