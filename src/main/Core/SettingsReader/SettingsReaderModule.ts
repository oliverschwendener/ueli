import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { SettingsFileReader } from "./SettingsFileReader";

export class SettingsReaderModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const settingsFile = moduleRegistry.get("SettingsFile");

        moduleRegistry.register("SettingsReader", new SettingsFileReader(settingsFile.path));
    }
}
