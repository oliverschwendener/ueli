import type { NativeTheme } from "electron";
import type { CommandlineUtility } from "../../CommandlineUtility";
import type { DependencyInjector } from "../../DependencyInjector";
import type { OperatingSystem } from "../../OperatingSystem";
import { CustomActionHandler } from "./ActionHandler/CustomActionHandler";
import { SystemColorThemeSwitcher } from "./SystemColorThemeSwitcher";

export class SystemColorThemeSwitcherModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        SystemColorThemeSwitcherModule.registerCustomActionHandler(dependencyInjector);
        SystemColorThemeSwitcherModule.registerExtension(dependencyInjector);
    }

    private static registerCustomActionHandler(dependencyInjector: DependencyInjector) {
        const operatingSystem = dependencyInjector.getInstance<OperatingSystem>("OperatingSystem");
        const commandlineUtility = dependencyInjector.getInstance<CommandlineUtility>("CommandlineUtility");
        const nativeTheme = dependencyInjector.getInstance<NativeTheme>("NativeTheme");

        dependencyInjector.registerActionHandler(
            new CustomActionHandler(operatingSystem, commandlineUtility, nativeTheme),
        );
    }

    private static registerExtension(dependencyInjector: DependencyInjector) {
        const operatingSystem = dependencyInjector.getInstance<OperatingSystem>("OperatingSystem");

        dependencyInjector.registerExtension(new SystemColorThemeSwitcher(operatingSystem));
    }
}
