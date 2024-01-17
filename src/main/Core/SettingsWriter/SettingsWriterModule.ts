import type { DependencyRegistry } from "../DependencyRegistry";
import { SettingsFileWriter } from "./SettingsFileWriter";

export class SettingsWriterModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry) {
        const settingsFile = dependencyRegistry.get("SettingsFile");

        dependencyRegistry.register("SettingsWriter", new SettingsFileWriter(settingsFile.path));
    }
}
