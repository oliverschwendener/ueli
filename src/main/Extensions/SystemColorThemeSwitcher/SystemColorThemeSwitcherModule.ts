import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import { CustomActionHandler } from "./CustomActionHandler";
import { SystemColorThemeSwitcher } from "./SystemColorThemeSwitcher";

export class SystemColorThemeSwitcherModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry): ExtensionBootstrapResult {
        const operatingSystem = dependencyRegistry.get("OperatingSystem");
        const commandlineUtility = dependencyRegistry.get("CommandlineUtility");
        const nativeTheme = dependencyRegistry.get("NativeTheme");
        const assetPathResolver = dependencyRegistry.get("AssetPathResolver");
        const translator = dependencyRegistry.get("Translator");

        return {
            extension: new SystemColorThemeSwitcher(operatingSystem, assetPathResolver, translator),
            actionHandlers: [new CustomActionHandler(operatingSystem, commandlineUtility, nativeTheme)],
        };
    }
}
