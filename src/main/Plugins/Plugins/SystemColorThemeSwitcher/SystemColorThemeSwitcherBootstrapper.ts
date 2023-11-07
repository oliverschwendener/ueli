import type { DependencyInjector } from "@common/DependencyInjector";
import type { OperatingSystem } from "@common/OperatingSystem";
import type { UeliPlugin } from "@common/UeliPlugin";
import type { UeliPluginBootstrapper } from "@common/UeliPluginBootstrapper";
import { SystemColorThemeSwitcher } from "./SystemColorThemeSwitcher";

export class SystemColorThemeSwitcherBootstrapper implements UeliPluginBootstrapper {
    public bootstrap(dependencyInjector: DependencyInjector): UeliPlugin {
        return new SystemColorThemeSwitcher(dependencyInjector.getInstance<OperatingSystem>("OperatingSystem"));
    }
}
