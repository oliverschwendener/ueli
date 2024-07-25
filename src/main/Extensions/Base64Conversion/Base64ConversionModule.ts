import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { Base64Conversion } from "./Base64Conversion";

export class Base64ConversionModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        const assetPathResolver = dependencyRegistry.get("AssetPathResolver");
        const translator = dependencyRegistry.get("Translator");

        return {
            extension: new Base64Conversion(assetPathResolver, translator),
        };
    }
}
