import type { DependencyInjector, SettingsManager } from "..";
import { Translator } from "./Translator";

export class TranslatorModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const settingsManager = dependencyInjector.getInstance<SettingsManager>("SettingsManager");

        dependencyInjector.registerInstance("Translator", new Translator(settingsManager));
    }
}
