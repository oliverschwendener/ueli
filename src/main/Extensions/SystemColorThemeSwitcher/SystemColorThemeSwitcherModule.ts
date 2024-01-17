import type { DependencyInjector } from "@Core/DependencyInjector";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import { CustomActionHandler } from "./CustomActionHandler";
import { SystemColorThemeSwitcher } from "./SystemColorThemeSwitcher";

export class SystemColorThemeSwitcherModule {
    public static bootstrap(dependencyInjector: DependencyInjector): ExtensionBootstrapResult {
        const operatingSystem = dependencyInjector.getInstance("OperatingSystem");
        const commandlineUtility = dependencyInjector.getInstance("CommandlineUtility");
        const nativeTheme = dependencyInjector.getInstance("NativeTheme");
        const assetPathResolver = dependencyInjector.getInstance("AssetPathResolver");
        const translator = dependencyInjector.getInstance("Translator");

        return {
            extension: new SystemColorThemeSwitcher(operatingSystem, assetPathResolver, translator),
            actionHandlers: [new CustomActionHandler(operatingSystem, commandlineUtility, nativeTheme)],
        };
    }
}
