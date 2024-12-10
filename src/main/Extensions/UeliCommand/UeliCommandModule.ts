import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { UeliCommandExtension } from "./UeliCommandExtension";

export class UeliCommandModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        return {
            extension: new UeliCommandExtension(
                dependencyRegistry.get("AssetPathResolver"),
                dependencyRegistry.get("Translator"),
                dependencyRegistry.get("SettingsManager"),
            ),
        };
    }
}
