import type { OperatingSystem } from "@common/OperatingSystem";
import type { PluginDependencies } from "@common/PluginDependencies";
import type { SearchResultItem } from "@common/SearchResultItem";
import type { UeliPlugin } from "@common/UeliPlugin";
import type { ApplicationRepository } from "./ApplicationRepository";
import { MacOsApplicationIconGenerator } from "./MacOsApplicationIconGenerator";
import { MacOsApplicationRepository } from "./MacOsApplicationRepository";
import { WindowsApplicationRepository } from "./WindowsApplicationRepository";

export class ApplicationSearchPlugin implements UeliPlugin {
    public readonly id = "ApplicationSearch";
    public readonly name = "Application Search";
    public readonly nameTranslationKey = "plugin[ApplicationSearch].pluginName";
    public readonly supportedOperatingSystems: OperatingSystem[] = ["macOS", "Windows"];

    private applicationRepositories: Record<OperatingSystem, ApplicationRepository>;

    public constructor(private readonly pluginDependencies: PluginDependencies) {
        this.applicationRepositories = {
            macOS: new MacOsApplicationRepository(
                pluginDependencies,
                new MacOsApplicationIconGenerator(pluginDependencies),
            ),
            Windows: new WindowsApplicationRepository(pluginDependencies),
        };
    }

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const { currentOperatingSystem } = this.pluginDependencies;

        const applications = await this.applicationRepositories[currentOperatingSystem].getApplications(this.id);

        return applications.map((application) => application.toSearchResultItem());
    }
}
