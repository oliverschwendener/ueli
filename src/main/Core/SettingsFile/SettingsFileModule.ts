import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { ConfigFileSettingsFilePathSource } from "./ConfigFileSettingsFilePathSource";
import { DefaultSettingsFilePathSource } from "./DefaultSettingsFilePathSource";
import { SettingsFilePathResolver } from "./SettingsFilePathResolver";

export class SettingsFileModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const app = moduleRegistry.get("App");
        const ipcMain = moduleRegistry.get("IpcMain");

        const configFileSettingsFilePathSource = new ConfigFileSettingsFilePathSource(
            app,
            moduleRegistry.get("FileSystemUtility"),
        );

        ipcMain.handle("setCustomSettingsFilePath", async (_, { filePath }: { filePath: string }) => {
            // TODO: write new file path to config file
            console.log(filePath);
        });

        // TODO: move this event handler to another module?
        ipcMain.on("restartApp", () => {
            app.relaunch();
            app.exit();
        });

        const defaultSettingsFilePathSource = new DefaultSettingsFilePathSource(app);

        const settingsFilePathResolver = new SettingsFilePathResolver(
            [configFileSettingsFilePathSource, defaultSettingsFilePathSource],
            moduleRegistry.get("Logger"),
        );

        moduleRegistry.register("SettingsFile", {
            path: settingsFilePathResolver.resolve(),
        });
    }
}
