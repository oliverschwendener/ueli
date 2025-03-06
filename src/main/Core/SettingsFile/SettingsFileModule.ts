import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { ConfigFileSettingsFilePathSource } from "./ConfigFileSettingsFilePathSource";
import { DefaultSettingsFilePathSource } from "./DefaultSettingsFilePathSource";
import { SettingsFilePathResolver } from "./SettingsFilePathResolver";

export class SettingsFileModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const app = moduleRegistry.get("App");
        const ipcMain = moduleRegistry.get("IpcMain");
        const logger = moduleRegistry.get("Logger");

        const configFileSettingsFilePathSource = new ConfigFileSettingsFilePathSource(
            app,
            moduleRegistry.get("FileSystemUtility"),
        );

        const settingsFilePathResolver = new SettingsFilePathResolver([
            configFileSettingsFilePathSource,
            new DefaultSettingsFilePathSource(app),
        ]);

        ipcMain.handle("setCustomSettingsFilePath", async (_, { filePath }: { filePath: string }) => {
            await configFileSettingsFilePathSource.writeFilePathToConfigFile(filePath);
        });

        ipcMain.on("getSettingsFilePath", (event) => {
            event.returnValue = settingsFilePathResolver.resolve();
        });

        logger.info(`Reading settings from file: ${settingsFilePathResolver.resolve()}`);

        moduleRegistry.register("SettingsFile", {
            path: settingsFilePathResolver.resolve(),
        });
    }
}
