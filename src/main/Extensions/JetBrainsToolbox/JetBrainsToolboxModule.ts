import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { JetBrainsToolboxExtension } from "./JetBrainsToolboxExtension";

export class JetBrainsToolboxModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        return {
            extension: new JetBrainsToolboxExtension(
                dependencyRegistry.get("OperatingSystem"),
                dependencyRegistry.get("AssetPathResolver"),
                dependencyRegistry.get("FileSystemUtility"),
                dependencyRegistry.get("XmlParser"),
                dependencyRegistry.get("Translator"),
            ),
        };
    }
}
