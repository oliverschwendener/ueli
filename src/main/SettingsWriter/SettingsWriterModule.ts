import type { DependencyInjector } from "@common/DependencyInjector";
import type { SettingsFile } from "@common/SettingsFile";
import type { SettingsWriter } from "@common/SettingsWriter";
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
