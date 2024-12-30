import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { SettingsFileWriter } from "./SettingsFileWriter";

export class SettingsWriterModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const settingsFile = moduleRegistry.get("SettingsFile");

        moduleRegistry.register("SettingsWriter", new SettingsFileWriter(settingsFile.path));
    }
}
