import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { SettingsFilePathResolver } from "./SettingsFilePathResolver";

export class SettingsFileModule {
    public static async bootstrap(moduleRegistry: UeliModuleRegistry) {
        const settingsFilePathResolver = new SettingsFilePathResolver(moduleRegistry.get("App"));

        moduleRegistry.register("SettingsFile", {
            path: await settingsFilePathResolver.resolve(),
        });
    }
}
