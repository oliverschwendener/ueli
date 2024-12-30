import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { CurrencyConversion } from "./CurrencyConversion";

export class CurrencyConversionModule implements ExtensionModule {
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        return {
            extension: new CurrencyConversion(
                moduleRegistry.get("SettingsManager"),
                moduleRegistry.get("Net"),
                moduleRegistry.get("AssetPathResolver"),
            ),
        };
    }
}
