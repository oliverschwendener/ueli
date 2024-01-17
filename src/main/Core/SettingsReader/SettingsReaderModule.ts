import type { DependencyInjector } from "../DependencyInjector";
import { SettingsFileReader } from "./SettingsFileReader";

export class SettingsReaderModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const settingsFile = dependencyInjector.getInstance("SettingsFile");

        dependencyInjector.registerInstance("SettingsReader", new SettingsFileReader(settingsFile.path));
    }
}
