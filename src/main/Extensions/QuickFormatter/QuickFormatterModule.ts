import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { QuickFormatterExtension } from "./QuickFormatterExtension";

export class QuickFormatterModule implements ExtensionModule {
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        return {
            extension: new QuickFormatterExtension(
                moduleRegistry.get("AssetPathResolver"),
                moduleRegistry.get("SettingsManager"),
            ),
        };
    }
}
