import type { DependencyInjector } from "@common/DependencyInjector";
import type { OperatingSystem } from "@common/OperatingSystem";
import { SystemColorThemeSwitcher } from "./SystemColorThemeSwitcher";

export class SystemColorThemeSwitcherModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        dependencyInjector.registerPlugin(
            new SystemColorThemeSwitcher(dependencyInjector.getInstance<OperatingSystem>("OperatingSystem")),
        );
    }
}
