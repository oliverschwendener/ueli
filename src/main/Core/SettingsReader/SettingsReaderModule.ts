import type { DependencyRegistry } from "../DependencyRegistry";
import { SettingsFileReader } from "./SettingsFileReader";

export class SettingsReaderModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry) {
        const settingsFile = dependencyRegistry.get("SettingsFile");

        dependencyRegistry.register("SettingsReader", new SettingsFileReader(settingsFile.path));
    }
}
