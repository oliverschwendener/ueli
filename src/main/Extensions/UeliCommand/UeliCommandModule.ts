import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { UeliCommandExtension } from "./UeliCommandExtension";

export class UeliCommandModule implements ExtensionModule {
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        return {
            extension: new UeliCommandExtension(
                moduleRegistry.get("AssetPathResolver"),
                moduleRegistry.get("Translator"),
                moduleRegistry.get("SettingsManager"),
            ),
        };
    }
}
