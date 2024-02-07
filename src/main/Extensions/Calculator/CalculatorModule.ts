import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { CalculatorExtension } from "./CalculatorExtension";

export class CalculatorModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        return {
            extension: new CalculatorExtension(
                dependencyRegistry.get("AssetPathResolver"),
                dependencyRegistry.get("SettingsManager"),
            ),
        };
    }
}
