import type { SearchResultItem } from "@common/SearchResultItem";
import type { DependencyInjector } from "../../DependencyInjector";
import type { OperatingSystem } from "../../OperatingSystem";
import type { UeliPlugin } from "../Contract";
import type { ApplicationRepository } from "./ApplicationRepository";

export class ApplicationSearch implements UeliPlugin {
    public readonly id = "ApplicationSearch";
    public readonly name = "Application Search";
    public readonly nameTranslationKey = "plugin[ApplicationSearch].pluginName";

    public constructor(private readonly applicationRepository: ApplicationRepository) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const applications = await this.applicationRepository.getApplications();
        return applications.map((application) => application.toSearchResultItem());
    }

    public isSupported(dependencyInjector: DependencyInjector): boolean {
        const currentOperatingSystem = dependencyInjector.getInstance<OperatingSystem>("OperatingSystem");
        const supportedOperatingSystems: OperatingSystem[] = ["Windows", "macOS"];
        return supportedOperatingSystems.includes(currentOperatingSystem);
    }
}
