import type { PluginDependencies } from "@common/PluginDependencies";
import type { UeliPlugin } from "@common/UeliPlugin";
import type { UeliPluginBootstrapper } from "@common/UeliPluginBootstrapper";
import { ApplicationSearch } from "./ApplicationSearch";
import { MacOsApplicationIconGenerator } from "./MacOsApplicationIconGenerator";
import { MacOsApplicationRepository } from "./MacOsApplicationRepository";
import { WindowsApplicationRepository } from "./WindowsApplicationRepository";

export class ApplicationSearchBootstrapper implements UeliPluginBootstrapper {
    public bootstrap(pluginDependencies: PluginDependencies): UeliPlugin {
        return new ApplicationSearch(
            {
                macOS: new MacOsApplicationRepository(
                    pluginDependencies,
                    new MacOsApplicationIconGenerator(pluginDependencies),
                ),
                Windows: new WindowsApplicationRepository(pluginDependencies),
            }[pluginDependencies.currentOperatingSystem],
        );
    }
}
