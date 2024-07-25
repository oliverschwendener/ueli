import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { ColorConverterExtension } from "./ColorConverterExtension";
import { QixColorConverter } from "./QixColorConverter";

export class ColorConverterExtensionModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        return {
            extension: new ColorConverterExtension(
                dependencyRegistry.get("AssetPathResolver"),
                dependencyRegistry.get("SettingsManager"),
                dependencyRegistry.get("Translator"),
                new QixColorConverter(),
            ),
        };
    }
}
