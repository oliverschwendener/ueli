import type { DependencyInjector } from "../../DependencyInjector";
import type { OperatingSystem } from "../../OperatingSystem";
import { SystemColorThemeSwitcher } from "./SystemColorThemeSwitcher";

export class SystemColorThemeSwitcherModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        dependencyInjector.registerPlugin(
            new SystemColorThemeSwitcher(dependencyInjector.getInstance<OperatingSystem>("OperatingSystem")),
        );
    }
}
