import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { UuidGeneratorExtension } from "./UuidGeneratorExtension";

export class UuidGeneratorModule implements ExtensionModule {
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        return {
            extension: new UuidGeneratorExtension(
                moduleRegistry.get("AssetPathResolver"),
                moduleRegistry.get("Translator"),
                moduleRegistry.get("SettingsManager"),
            ),
        };
    }
}
