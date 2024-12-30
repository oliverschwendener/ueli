import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { CustomWebSearchExtension } from "./CustomWebSearchExtension";

export class CustomWebSearchModule implements ExtensionModule {
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        return {
            extension: new CustomWebSearchExtension(
                moduleRegistry.get("AssetPathResolver"),
                moduleRegistry.get("SettingsManager"),
                moduleRegistry.get("UrlImageGenerator"),
            ),
        };
    }
}
