import type { DependencyInjector } from "../DependencyInjector";
import { SettingsFileWriter } from "./SettingsFileWriter";

export class SettingsWriterModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const settingsFile = dependencyInjector.getInstance("SettingsFile");

        dependencyInjector.registerInstance("SettingsWriter", new SettingsFileWriter(settingsFile.path));
    }
}
