import type { OperatingSystem } from "@common/OperatingSystem";
import type { PluginDependencies } from "@common/PluginDependencies";
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

    private pluginDependencies: PluginDependencies;
    private applicationRepositories: Record<OperatingSystem, ApplicationRepository>;

    public setPluginDependencies(pluginDependencies: PluginDependencies): void {
        this.pluginDependencies = pluginDependencies;

        this.applicationRepositories = {
            macOS: new MacOsApplicationRepository(
                pluginDependencies,
                this.id,
                new MacOsApplicationIconGenerator(pluginDependencies),
            ),
            Windows: new WindowsApplicationRepository(pluginDependencies, this.id),
        };
    }

    public async addSearchResultItemsToSearchIndex(): Promise<void> {
        const { currentOperatingSystem, searchIndex } = this.pluginDependencies;

        const applications = await this.applicationRepositories[currentOperatingSystem].getApplications();

        searchIndex.addSearchResultItems(
            this.id,
            applications.map((application) => application.toSearchResultItem()),
        );
    }
}
