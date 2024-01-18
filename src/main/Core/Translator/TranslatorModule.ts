import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { Translator } from "./Translator";

export class TranslatorModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const settingsManager = dependencyRegistry.get("SettingsManager");

        dependencyRegistry.register("Translator", new Translator(settingsManager));
    }
}
