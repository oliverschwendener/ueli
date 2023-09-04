import type { OperatingSystem } from "@common/OperatingSystem";
import type { Plugin } from "../Plugin";
import type { PluginDependencies } from "../PluginDependencies";
import type { ApplicationRepository } from "./ApplicationRepository";
import { MacOsApplicationRepository } from "./MacOsApplicationRepository";
import { WindowsApplicationRepository } from "./WindowsApplicationRepository";

export class ApplicationSearchPlugin implements Plugin {
    private static readonly Id = "ApplicationSearch";

    private applicationRepositories: Record<OperatingSystem, ApplicationRepository>;

    public constructor(private readonly pluginDependencies: PluginDependencies) {
        this.applicationRepositories = {
            macOS: new MacOsApplicationRepository(pluginDependencies, ApplicationSearchPlugin.Id),
            Windows: new WindowsApplicationRepository(pluginDependencies, ApplicationSearchPlugin.Id),
        };
    }

    public getSupportedOperatingSystems(): OperatingSystem[] {
        return ["macOS", "Windows"];
    }

    public async addSearchResultItemsToSearchIndex(): Promise<void> {
        const { searchIndex } = this.pluginDependencies;

        const applications =
            await this.applicationRepositories[this.pluginDependencies.operatingSystem].getApplications();

        searchIndex.addSearchResultItems(
            ApplicationSearchPlugin.Id,
            applications.map((applicaiton) => applicaiton.toSearchResultItem()),
        );
    }
}
