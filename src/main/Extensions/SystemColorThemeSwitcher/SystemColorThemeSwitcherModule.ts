import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { DependencyInjector } from "@Core/DependencyInjector";
import type { ExtensionAssetPathResolver } from "@Core/ExtensionAssets";
import type { OperatingSystem } from "@common/OperatingSystem";
import type { NativeTheme } from "electron";
import { CustomActionHandler } from "./CustomActionHandler";
import { SystemColorThemeSwitcher } from "./SystemColorThemeSwitcher";

export class SystemColorThemeSwitcherModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const operatingSystem = dependencyInjector.getInstance<OperatingSystem>("OperatingSystem");
        const commandlineUtility = dependencyInjector.getInstance<CommandlineUtility>("CommandlineUtility");
        const nativeTheme = dependencyInjector.getInstance<NativeTheme>("NativeTheme");
        const extensionAssetPathResolver =
            dependencyInjector.getInstance<ExtensionAssetPathResolver>("ExtensionAssetPathResolver");

        dependencyInjector.registerExtension(new SystemColorThemeSwitcher(operatingSystem, extensionAssetPathResolver));
        dependencyInjector.registerActionHandler(
            new CustomActionHandler(operatingSystem, commandlineUtility, nativeTheme),
        );
    }
}
