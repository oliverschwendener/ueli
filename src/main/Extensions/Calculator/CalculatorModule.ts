import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { CalculatorExtension } from "./CalculatorExtension";

export class CalculatorModule implements ExtensionModule {
    public bootstrap(moduleRegistry: UeliModuleRegistry): ExtensionBootstrapResult {
        return {
            extension: new CalculatorExtension(
                moduleRegistry.get("AssetPathResolver"),
                moduleRegistry.get("SettingsManager"),
            ),
        };
    }
}
