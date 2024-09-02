import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { VSCodeExtension } from "./VSCodeExtension";

export class VSCodeModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        return {
            extension: new VSCodeExtension(
                dependencyRegistry.get("OperatingSystem"),
                dependencyRegistry.get("AssetPathResolver"),
                dependencyRegistry.get("SettingsManager"),
                dependencyRegistry.get("FileImageGenerator"),
            ),
        };
    }
}
