import type { OperatingSystem } from "@common/OperatingSystem";
import type { UeliPlugin } from "@common/UeliPlugin";
import type { SearchIndex } from "../../SearchIndex";
import type { PluginDependencies } from "../PluginDependencies";
import type { ApplicationRepository } from "./ApplicationRepository";
import { MacOsApplicationIconGenerator } from "./MacOsApplicationIconGenerator";
import { MacOsApplicationRepository } from "./MacOsApplicationRepository";
import { WindowsApplicationRepository } from "./WindowsApplicationRepository";

export class ApplicationSearchPlugin implements UeliPlugin {
    public readonly id = "ApplicationSearch";
    public readonly name = "Application Search";
    public readonly nameTranslationKey = "plugin[ApplicationSearch].pluginName";
    public readonly supportedOperatingSystems: OperatingSystem[] = ["macOS", "Windows"];

    private currentOperatingSystem: OperatingSystem;
    private searchIndex: SearchIndex;

    private applicationRepositories: Record<OperatingSystem, ApplicationRepository>;

    public setPluginDependencies(pluginDependencies: PluginDependencies): void {
        this.currentOperatingSystem = pluginDependencies.operatingSystem;
        this.searchIndex = pluginDependencies.searchIndex;

        this.applicationRepositories = {
            macOS: new MacOsApplicationRepository(
                pluginDependencies.commandlineUtility,
                pluginDependencies.settingsManager,
                pluginDependencies.app,
                this.id,
                new MacOsApplicationIconGenerator(pluginDependencies),
            ),
            Windows: new WindowsApplicationRepository(
                pluginDependencies.pluginCacheFolderPath,
                pluginDependencies.fileSystemUtility,
                pluginDependencies.commandlineUtility,
                pluginDependencies.settingsManager,
                pluginDependencies.app,
                this.id,
            ),
        };
    }

    public async addSearchResultItemsToSearchIndex(): Promise<void> {
        const applications = await this.applicationRepositories[this.currentOperatingSystem].getApplications();

        this.searchIndex.addSearchResultItems(
            this.id,
            applications.map((application) => application.toSearchResultItem()),
        );
    }
}
