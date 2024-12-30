import type { OperatingSystem } from "@common/Core";
import type { Terminal } from "@common/Core/Terminal";
import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { Terminal as TerminalContract } from "./Contract";
import { TerminalRegistry } from "./TerminalRegistry";
import { CommandPrompt, Iterm, MacOsTerminal, Powershell, PowershellCore, Wsl } from "./Terminals";

export class TerminalModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const ipcMain = moduleRegistry.get("IpcMain");
        const assetPathResolver = moduleRegistry.get("AssetPathResolver");

        const terminals: Record<OperatingSystem, () => TerminalContract[]> = {
            Linux: () => [],
            macOS: () => [
                new MacOsTerminal(moduleRegistry.get("AppleScriptUtility")),
                new Iterm(moduleRegistry.get("AppleScriptUtility")),
            ],
            Windows: () => [
                new CommandPrompt(moduleRegistry.get("CommandlineUtility")),
                new Powershell(moduleRegistry.get("CommandlineUtility")),
                new PowershellCore(moduleRegistry.get("CommandlineUtility")),
                new Wsl(moduleRegistry.get("CommandlineUtility")),
            ],
        };

        const terminalRegistry = new TerminalRegistry(terminals[moduleRegistry.get("OperatingSystem")]());

        moduleRegistry.register("TerminalRegistry", terminalRegistry);

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
