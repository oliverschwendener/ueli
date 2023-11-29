import type { DependencyInjector } from "../DependencyInjector";
import type { SettingsFile } from "../SettingsFile";
import type { SettingsWriter } from "./Contract";
import { SettingsFileWriter } from "./SettingsFileWriter";

export class SettingsWriterModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const settingsFile = dependencyInjector.getInstance<SettingsFile>("SettingsFile");

        dependencyInjector.registerInstance<SettingsWriter>(
            "SettingsWriter",
            new SettingsFileWriter(settingsFile.path),
        );
    }
}
