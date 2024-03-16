import type { AssetPathResolver } from "@Core/AssetPathResolver";
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
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const applications = await this.applicationRepository.getApplications();
        return applications.map((application) => application.toSearchResultItem());
    }

    public isSupported(): boolean {
        const supportedOperatingSystems: OperatingSystem[] = ["Windows", "macOS", "Linux"];
        return supportedOperatingSystems.includes(this.operatingSystem);
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
        const fileNames: Record<OperatingSystem, { neutral: string; dark?: string; light?: string }> = {
            Linux: { neutral: "linux-applications.png" },
            macOS: { neutral: "macos-applications.png" },
            Windows: {
                neutral: "windows-applications-light.png",
                dark: "windows-applications-light.png",
                light: "windows-applications-dark.png",
            },
        };

        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, fileNames[this.operatingSystem].neutral)}`,
            urlOnDarkBackground: fileNames[this.operatingSystem].dark
                ? `file://${this.assetPathResolver.getExtensionAssetPath(this.id, fileNames[this.operatingSystem].dark)}`
                : undefined,
            urlOnLightBackground: fileNames[this.operatingSystem].light
                ? `file://${this.assetPathResolver.getExtensionAssetPath(this.id, fileNames[this.operatingSystem].light)}`
                : undefined,
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
