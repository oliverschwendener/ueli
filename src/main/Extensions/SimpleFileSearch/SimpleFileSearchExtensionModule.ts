import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { SimpleFileSearchExtension } from "./SimpleFileSearchExtension";

export class SimpleFileSearchExtensionModule implements ExtensionModule {
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        return {
            extension: new SimpleFileSearchExtension(
                moduleRegistry.get("FileSystemUtility"),
                moduleRegistry.get("FileImageGenerator"),
                moduleRegistry.get("Logger"),
                moduleRegistry.get("AssetPathResolver"),
                moduleRegistry.get("OperatingSystem"),
                moduleRegistry.get("SettingsManager"),
                moduleRegistry.get("Translator"),
            ),
        };
    }
}
