import type { DependencyRegistry } from "..";
import { Translator } from "./Translator";

export class TranslatorModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry) {
        const settingsManager = dependencyRegistry.get("SettingsManager");

        dependencyRegistry.register("Translator", new Translator(settingsManager));
    }
}
