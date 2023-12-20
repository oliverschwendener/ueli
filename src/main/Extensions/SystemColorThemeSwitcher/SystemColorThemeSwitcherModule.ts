import type { OperatingSystem } from "@common/OperatingSystem";
import type { NativeTheme } from "electron";
import type { CommandlineUtility } from "../../CommandlineUtility";
import type { DependencyInjector } from "../../DependencyInjector";
import { CustomActionHandler } from "./CustomActionHandler";
import { SystemColorThemeSwitcher } from "./SystemColorThemeSwitcher";

export class SystemColorThemeSwitcherModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const operatingSystem = dependencyInjector.getInstance<OperatingSystem>("OperatingSystem");
        const commandlineUtility = dependencyInjector.getInstance<CommandlineUtility>("CommandlineUtility");
        const nativeTheme = dependencyInjector.getInstance<NativeTheme>("NativeTheme");

        dependencyInjector.registerExtension(new SystemColorThemeSwitcher(operatingSystem));
        dependencyInjector.registerActionHandler(
            new CustomActionHandler(operatingSystem, commandlineUtility, nativeTheme),
        );
    }
}
