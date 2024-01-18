import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { Extension } from "@Core/Extension";
import type { OperatingSystem, SearchResultItem } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { ApplicationRepository } from "./ApplicationRepository";
import type { Settings } from "./Settings";

export class ApplicationSearch implements Extension {
    public readonly id = "ApplicationSearch";
    public readonly name = "Application Search";
    public readonly nameTranslationKey = "extension[ApplicationSearch].extensionName";

    public readonly settingKeysTriggeringReindex = [
        getExtensionSettingKey("ApplicationSearch", "windowsFolders"),
        getExtensionSettingKey("ApplicationSearch", "windowsFileExtensions"),
        getExtensionSettingKey("ApplicationSearch", "macOsFolders"),
    ];

    public constructor(
        private readonly applicationRepository: ApplicationRepository,
        private readonly settings: Settings,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const applications = await this.applicationRepository.getApplications();
        return applications.map((application) => application.toSearchResultItem());
    }

    public isSupported(dependencyRegistry: DependencyRegistry<Dependencies>): boolean {
        const currentOperatingSystem = dependencyRegistry.get("OperatingSystem");
        const supportedOperatingSystems: OperatingSystem[] = ["Windows", "macOS"];
        return supportedOperatingSystems.includes(currentOperatingSystem);
    }

    public getSettingDefaultValue<T>(key: string): T {
        return this.settings.getDefaultValue<T>(key);
    }
}
