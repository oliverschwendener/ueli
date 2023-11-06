import type { PluginDependencies } from "@common/PluginDependencies";
import type { UeliPlugin } from "@common/UeliPlugin";
import type { UeliPluginBootstrapper } from "@common/UeliPluginBootstrapper";
import { SystemColorThemeSwitcher } from "./SystemColorThemeSwitcher";

export class SystemColorThemeSwitcherBootstrapper implements UeliPluginBootstrapper {
    public bootstrap(pluginDependencies: PluginDependencies): UeliPlugin {
        return new SystemColorThemeSwitcher(pluginDependencies.currentOperatingSystem);
    }
}
