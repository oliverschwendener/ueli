import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { SimpleFolderSearch } from "./SimpleFolderSearch";

export class SimpleFolderSearchModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        return {
            extension: new SimpleFolderSearch(
                dependencyRegistry.get("App"),
                dependencyRegistry.get("OperatingSystem"),
                dependencyRegistry.get("AssetPathResolver"),
                dependencyRegistry.get("FileSystemUtility"),
                dependencyRegistry.get("SettingsManager"),
                dependencyRegistry.get("Translator"),
            ),
        };
    }
}
