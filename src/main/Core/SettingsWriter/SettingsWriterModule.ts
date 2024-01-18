import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { SettingsFileWriter } from "./SettingsFileWriter";

export class SettingsWriterModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const settingsFile = dependencyRegistry.get("SettingsFile");

        dependencyRegistry.register("SettingsWriter", new SettingsFileWriter(settingsFile.path));
    }
}
