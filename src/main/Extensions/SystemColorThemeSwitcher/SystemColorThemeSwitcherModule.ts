import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { DependencyInjector } from "@Core/DependencyInjector";
import type { Translator } from "@Core/Translator";
import type { OperatingSystem } from "@common/Core";
import type { NativeTheme } from "electron";
import type { ExtensionBootstrapResult } from "../ExtensionBootstrapResult";
import { CustomActionHandler } from "./CustomActionHandler";
import { SystemColorThemeSwitcher } from "./SystemColorThemeSwitcher";

export class SystemColorThemeSwitcherModule {
    public static bootstrap(dependencyInjector: DependencyInjector): ExtensionBootstrapResult {
        const operatingSystem = dependencyInjector.getInstance<OperatingSystem>("OperatingSystem");
        const commandlineUtility = dependencyInjector.getInstance<CommandlineUtility>("CommandlineUtility");
        const nativeTheme = dependencyInjector.getInstance<NativeTheme>("NativeTheme");
        const assetPathResolver = dependencyInjector.getInstance<AssetPathResolver>("AssetPathResolver");
        const translator = dependencyInjector.getInstance<Translator>("Translator");

        return {
            extension: new SystemColorThemeSwitcher(operatingSystem, assetPathResolver, translator),
            actionHandlers: [new CustomActionHandler(operatingSystem, commandlineUtility, nativeTheme)],
        };
    }
}
