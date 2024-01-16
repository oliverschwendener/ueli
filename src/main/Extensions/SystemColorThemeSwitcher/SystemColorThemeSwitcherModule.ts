import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { DependencyInjector } from "@Core/DependencyInjector";
import type { Translator } from "@Core/Translator";
import type { OperatingSystem } from "@common/Core";
import type { NativeTheme } from "electron";
import { CustomActionHandler } from "./CustomActionHandler";
import { SystemColorThemeSwitcher } from "./SystemColorThemeSwitcher";

export class SystemColorThemeSwitcherModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const operatingSystem = dependencyInjector.getInstance<OperatingSystem>("OperatingSystem");
        const commandlineUtility = dependencyInjector.getInstance<CommandlineUtility>("CommandlineUtility");
        const nativeTheme = dependencyInjector.getInstance<NativeTheme>("NativeTheme");
        const assetPathResolver = dependencyInjector.getInstance<AssetPathResolver>("AssetPathResolver");
        const translator = dependencyInjector.getInstance<Translator>("Translator");

        dependencyInjector.registerExtension(
            new SystemColorThemeSwitcher(operatingSystem, assetPathResolver, translator),
        );

        dependencyInjector.registerActionHandler(
            new CustomActionHandler(operatingSystem, commandlineUtility, nativeTheme),
        );
    }
}
