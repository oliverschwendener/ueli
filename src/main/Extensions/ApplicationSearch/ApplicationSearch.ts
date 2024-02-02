import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { OperatingSystem, SearchResultItem } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { ApplicationRepository } from "./ApplicationRepository";
import type { Settings } from "./Settings";

export class ApplicationSearch implements Extension {
    public readonly id = "ApplicationSearch";
    public readonly name = "Application Search";

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: "extension[ApplicationSearch]",
    };

    public readonly author = {
        name: "Oliver Schwendener",
        githubUserName: "oliverschwendener",
    };

    public constructor(
        private readonly currentOperatingSystem: OperatingSystem,
        private readonly applicationRepository: ApplicationRepository,
        private readonly settings: Settings,
        private readonly assetPathResolver: AssetPathResolver,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const applications = await this.applicationRepository.getApplications();
        return applications.map((application) => application.toSearchResultItem());
    }

    public isSupported(): boolean {
        const supportedOperatingSystems: OperatingSystem[] = ["Windows", "macOS"];
        return supportedOperatingSystems.includes(this.currentOperatingSystem);
    }

    public getSettingDefaultValue<T>(key: string): T {
        return this.settings.getDefaultValue<T>(key);
    }

    public getSettingKeysTriggeringRescan() {
        return [
            getExtensionSettingKey("ApplicationSearch", "windowsFolders"),
            getExtensionSettingKey("ApplicationSearch", "windowsFileExtensions"),
            getExtensionSettingKey("ApplicationSearch", "macOsFolders"),
        ];
    }

    public getImageUrl(): string {
        return `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "macos-applications.png")}`;
    }
}
