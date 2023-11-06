import type { PluginDependencies } from "@common/PluginDependencies";
import type { UeliPlugin } from "@common/UeliPlugin";
import type { UeliPluginBootstrapper } from "@common/UeliPluginBootstrapper";
import { ApplicationSearch } from "./ApplicationSearch";
import { WindowsApplicationRepository } from "./Windows/WindowsApplicationRepository";
import { MacOsApplicationIconGenerator } from "./macOS/MacOsApplicationIconGenerator";
import { MacOsApplicationRepository } from "./macOS/MacOsApplicationRepository";

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
