import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { CustomWebSearchExtension } from "./CustomWebSearchExtension";

export class CustomWebSearchModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        return {
            extension: new CustomWebSearchExtension(
                dependencyRegistry.get("OperatingSystem"),
                dependencyRegistry.get("AssetPathResolver"),
                dependencyRegistry.get("SettingsManager"),
            ),
        };
    }
}
