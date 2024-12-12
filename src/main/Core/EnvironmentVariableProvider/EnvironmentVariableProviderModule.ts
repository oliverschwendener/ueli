import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { EnvironmentVariableProvider } from "./EnvironmentVariableProvider";

export class EnvironmentVariableProviderModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): void {
        const ipcMain = dependencyRegistry.get("IpcMain");

        const environmentVariableProvider = new EnvironmentVariableProvider(<Record<string, string>>process.env);

        dependencyRegistry.register("EnvironmentVariableProvider", environmentVariableProvider);

        ipcMain.on("getEnvironmentVariable", (event, { environmentVariable }) => {
            event.returnValue = environmentVariableProvider.get(environmentVariable);
        });
    }
}
