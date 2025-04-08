import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { CustomSettingsFilePathResolver, DefaultSettingsFilePathResolver } from "./Resolver";
import { CustomSettingsFilePathValidator } from "./Resolver/CustomSettingsFilePathValidator";

export class SettingsFileModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const customSettingsFilePathResolver = new CustomSettingsFilePathResolver(
            moduleRegistry.get("App"),
            moduleRegistry.get("FileSystemUtility"),
        );

        const customSettingsFilePathValidator = new CustomSettingsFilePathValidator(
            moduleRegistry.get("FileSystemUtility"),
        );

        const defaultSettingsFilePathResolver = new DefaultSettingsFilePathResolver(moduleRegistry.get("App"));

        const resolveFilePath = () =>
            customSettingsFilePathResolver.resolve() ?? defaultSettingsFilePathResolver.resolve();

        const ipcMain = moduleRegistry.get("IpcMain");

        ipcMain.on("removeCustomSettingsFilePath", () => {
            customSettingsFilePathResolver.remove();
        });

        ipcMain.handle("setCustomSettingsFilePath", async (_, { filePath }: { filePath: string }) => {
            await customSettingsFilePathResolver.writeFilePathToConfigFile(filePath);
        });

        ipcMain.on("getCustomSettingsFilePath", (event) => {
            event.returnValue = customSettingsFilePathResolver.resolve();
        });

        ipcMain.on("isValidSettingsFile", (event, { filePath }: { filePath: string }) => {
            event.returnValue = customSettingsFilePathValidator.validate(filePath);
        });

        const logger = moduleRegistry.get("Logger");
        logger.info(`Reading settings from ${resolveFilePath()}`);

        moduleRegistry.register("SettingsFile", {
            path: resolveFilePath(),
        });
    }
}
