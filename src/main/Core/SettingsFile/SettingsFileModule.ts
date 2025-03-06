import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { ConfigFileSettingsFilePathSource } from "./ConfigFileSettingsFilePathSource";
import { DefaultSettingsFilePathSource } from "./DefaultSettingsFilePathSource";
import { SettingsFilePathResolver } from "./SettingsFilePathResolver";

export class SettingsFileModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const settingsFilePathResolver = new SettingsFilePathResolver(
            [
                new ConfigFileSettingsFilePathSource(
                    moduleRegistry.get("App"),
                    moduleRegistry.get("FileSystemUtility"),
                ),
                new DefaultSettingsFilePathSource(moduleRegistry.get("App")),
            ],
            moduleRegistry.get("Logger"),
        );

        moduleRegistry.register("SettingsFile", {
            path: settingsFilePathResolver.resolve(),
        });
    }
}
