import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { DefaultSettingsFilePathSource } from "./DefaultSettingsFilePathSource";
import { SettingsFilePathResolver } from "./SettingsFilePathResolver";

export class SettingsFileModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const settingsFilePathResolver = new SettingsFilePathResolver([
            // TODO: add more sources
            new DefaultSettingsFilePathSource(moduleRegistry.get("App")),
        ]);

        moduleRegistry.register("SettingsFile", {
            path: settingsFilePathResolver.resolve(),
        });
    }
}
