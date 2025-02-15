import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { VSCodeExtension } from "./VSCodeExtension";

export class VSCodeModule implements ExtensionModule {
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        return {
            extension: new VSCodeExtension(
                moduleRegistry.get("OperatingSystem"),
                moduleRegistry.get("AssetPathResolver"),
                moduleRegistry.get("Logger"),
                moduleRegistry.get("SettingsManager"),
                moduleRegistry.get("FileImageGenerator"),
                moduleRegistry.get("FileSystemUtility"),
            ),
        };
    }
}
