import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { SimpleFileSearchExtension } from "./SimpleFileSearchExtension";

export class SimpleFileSearchExtensionModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        return {
            extension: new SimpleFileSearchExtension(
                dependencyRegistry.get("FileSystemUtility"),
                dependencyRegistry.get("FileImageGenerator"),
                dependencyRegistry.get("Logger"),
                dependencyRegistry.get("AssetPathResolver"),
                dependencyRegistry.get("OperatingSystem"),
                dependencyRegistry.get("SettingsManager"),
                dependencyRegistry.get("App"),
                dependencyRegistry.get("Translator"),
            ),
        };
    }
}
