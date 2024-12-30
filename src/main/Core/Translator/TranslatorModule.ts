import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { Translator } from "./Translator";

export class TranslatorModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const settingsManager = moduleRegistry.get("SettingsManager");

        moduleRegistry.register("Translator", new Translator(settingsManager));
    }
}
