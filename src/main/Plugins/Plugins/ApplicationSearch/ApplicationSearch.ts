import type { OperatingSystem } from "@common/OperatingSystem";
import type { PluginDependencies } from "@common/PluginDependencies";
import type { SearchResultItem } from "@common/SearchResultItem";
import type { UeliPlugin } from "@common/UeliPlugin";
import type { ApplicationRepository } from "./ApplicationRepository";
import { MacOsApplicationIconGenerator } from "./MacOsApplicationIconGenerator";
import { MacOsApplicationRepository } from "./MacOsApplicationRepository";
import { WindowsApplicationRepository } from "./WindowsApplicationRepository";

export class ApplicationSearch implements UeliPlugin {
    public readonly id = "ApplicationSearch";
    public readonly name = "Application Search";
    public readonly nameTranslationKey = "plugin[ApplicationSearch].pluginName";
    public readonly supportedOperatingSystems: OperatingSystem[] = ["macOS", "Windows"];

    private applicationRepository: ApplicationRepository;

    public constructor(pluginDependencies: PluginDependencies) {
        const { currentOperatingSystem } = pluginDependencies;

        this.applicationRepository = {
            macOS: new MacOsApplicationRepository(
                pluginDependencies,
                new MacOsApplicationIconGenerator(pluginDependencies),
            ),
            Windows: new WindowsApplicationRepository(pluginDependencies),
        }[currentOperatingSystem];
    }

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const applications = await this.applicationRepository.getApplications(this.id);

        return applications.map((application) => application.toSearchResultItem());
    }
}
