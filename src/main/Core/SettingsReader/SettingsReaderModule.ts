import type { DependencyInjector } from "../DependencyInjector";
import type { SettingsFile } from "../SettingsFile";
import type { SettingsReader } from "./Contract";
import { SettingsFileReader } from "./SettingsFileReader";

export class SettingsReaderModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const settingsFile = dependencyInjector.getInstance<SettingsFile>("SettingsFile");

        dependencyInjector.registerInstance<SettingsReader>(
            "SettingsReader",
            new SettingsFileReader(settingsFile.path),
        );
    }
}
