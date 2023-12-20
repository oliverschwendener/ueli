import type { OperatingSystem } from "@common/OperatingSystem";
import type { SearchResultItem } from "@common/SearchResultItem";
import type { DependencyInjector } from "../../DependencyInjector";
import type { Extension } from "../../Extension";
import type { ApplicationRepository } from "./ApplicationRepository";

export class ApplicationSearch implements Extension {
    public readonly id = "ApplicationSearch";
    public readonly name = "Application Search";
    public readonly nameTranslationKey = "extension[ApplicationSearch].extensionName";

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
