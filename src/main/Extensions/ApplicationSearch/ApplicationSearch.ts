import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { EnvironmentVariableProvider } from "@Core/EnvironmentVariableProvider";
import type { Extension } from "@Core/Extension";
import type { OperatingSystem, SearchResultItem } from "@common/Core";
import { getExtensionSettingKey, type Translations } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
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
        private readonly operatingSystem: OperatingSystem,
        private readonly applicationRepository: ApplicationRepository,
        private readonly settings: Settings,
        private readonly assetPathResolver: AssetPathResolver,
        private readonly environmentVariableProvider: EnvironmentVariableProvider,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const applications = await this.applicationRepository.getApplications();
        return applications.map((application) => application.toSearchResultItem());
    }

    public isSupported(): boolean {
        const checks: Record<OperatingSystem, () => boolean> = {
            Linux: () => ["cinnamon", "gnome"].includes(this.environmentVariableProvider.get("XDG_SESSION_DESKTOP")),
            macOS: () => true,
            Windows: () => true,
        };

        return checks[this.operatingSystem]();
    }

    public getSettingDefaultValue<T>(key: string): T {
        return this.settings.getDefaultValue<T>(key);
    }

    public getSettingKeysTriggeringRescan() {
        return [
            getExtensionSettingKey("ApplicationSearch", "windowsFolders"),
            getExtensionSettingKey("ApplicationSearch", "windowsFileExtensions"),
            getExtensionSettingKey("ApplicationSearch", "includeWindowsStoreApps"),
            getExtensionSettingKey("ApplicationSearch", "macOsFolders"),
        ];
    }

    public getImage(): Image {
        const fileNames: Record<OperatingSystem, { neutral: string }> = {
            Linux: { neutral: "linux-applications.png" },
            macOS: { neutral: "macos-applications.png" },
            Windows: { neutral: "windows-generic-app-icon.png" },
        };

        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, fileNames[this.operatingSystem].neutral)}`,
        };
    }

    public getTranslations(): Translations {
        return {
            "en-US": {
                extensionName: "Application Search",
                searchResultItemDescription: "Application",
                openApplication: "Open application",
                copyFilePathToClipboard: "Copy file path to clipboard",
            },
            "de-CH": {
                extensionName: "Anwendungssuche",
                searchResultItemDescription: "Anwendung",
                openApplication: "Anwendung öffnen",
                copyFilePathToClipboard: "Dateipfad in Zwischenablage kopieren",
            },
        };
    }
}
