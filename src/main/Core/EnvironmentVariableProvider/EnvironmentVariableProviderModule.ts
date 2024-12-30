import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { EnvironmentVariableProvider } from "./EnvironmentVariableProvider";

export class EnvironmentVariableProviderModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry): void {
        const ipcMain = moduleRegistry.get("IpcMain");

        const environmentVariableProvider = new EnvironmentVariableProvider(<Record<string, string>>process.env);

        moduleRegistry.register("EnvironmentVariableProvider", environmentVariableProvider);

        ipcMain.on("getEnvironmentVariable", (event, { environmentVariable }) => {
            event.returnValue = environmentVariableProvider.get(environmentVariable);
        });
    }
}
