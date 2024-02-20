import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { CurrencyConversion } from "./CurrencyConversion";

export class CurrencyConversionModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        return {
            extension: new CurrencyConversion(
                dependencyRegistry.get("SettingsManager"),
                dependencyRegistry.get("Net"),
                dependencyRegistry.get("AssetPathResolver"),
            ),
        };
    }
}
