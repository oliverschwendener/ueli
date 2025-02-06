import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { Base64Conversion } from "./Base64Conversion";

export class Base64ConversionModule implements ExtensionModule {
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        const assetPathResolver = moduleRegistry.get("AssetPathResolver");
        const translator = moduleRegistry.get("Translator");
        const settingsManager = moduleRegistry.get("SettingsManager");
        return {
            extension: new Base64Conversion(assetPathResolver, translator, settingsManager),
        };
    }
}
