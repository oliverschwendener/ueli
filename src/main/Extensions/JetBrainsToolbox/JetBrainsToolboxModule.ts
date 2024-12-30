import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { JetBrainsToolboxExtension } from "./JetBrainsToolboxExtension";

export class JetBrainsToolboxModule implements ExtensionModule {
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        return {
            extension: new JetBrainsToolboxExtension(
                moduleRegistry.get("OperatingSystem"),
                moduleRegistry.get("AssetPathResolver"),
                moduleRegistry.get("FileSystemUtility"),
                moduleRegistry.get("XmlParser"),
                moduleRegistry.get("Translator"),
            ),
        };
    }
}
