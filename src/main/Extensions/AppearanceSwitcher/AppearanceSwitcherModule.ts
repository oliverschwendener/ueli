import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import type { ExtensionModule } from "../ExtensionModule";
import { AppearanceSwitcher } from "./AppearanceSwitcher";
import { CustomActionHandler } from "./CustomActionHandler";

export class AppearanceSwitcherModule implements ExtensionModule {
    public bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): ExtensionBootstrapResult {
        const operatingSystem = dependencyRegistry.get("OperatingSystem");
        const commandlineUtility = dependencyRegistry.get("CommandlineUtility");
        const nativeTheme = dependencyRegistry.get("NativeTheme");
        const assetPathResolver = dependencyRegistry.get("AssetPathResolver");
        const translator = dependencyRegistry.get("Translator");

        return {
            extension: new AppearanceSwitcher(operatingSystem, assetPathResolver, translator),
            actionHandlers: [new CustomActionHandler(operatingSystem, commandlineUtility, nativeTheme)],
        };
    }
}
