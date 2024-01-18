import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { SettingsFileReader } from "./SettingsFileReader";

export class SettingsReaderModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const settingsFile = dependencyRegistry.get("SettingsFile");

        dependencyRegistry.register("SettingsReader", new SettingsFileReader(settingsFile.path));
    }
}
