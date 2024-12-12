import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { UuidGeneratorExtension } from "./UuidGeneratorExtension";

export class UuidGeneratorModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        return {
            extension: new UuidGeneratorExtension(
                dependencyRegistry.get("AssetPathResolver"),
                dependencyRegistry.get("Translator"),
                dependencyRegistry.get("SettingsManager"),
            ),
        };
    }
}
