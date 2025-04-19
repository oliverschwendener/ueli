import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { OperatingSystem, SearchResultItem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { SystemSettingRepository } from "./SystemSettingRepository";

export class SystemSettingsExtension implements Extension {
    public readonly id = "SystemSettings";
    public readonly name = "System Settings";

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: "extension[SystemSettings]",
    };

    public readonly author = {
        name: "Oliver Schwendener",
        githubUserName: "oliverschwendener",
    };

    public constructor(
        private readonly operatingSystem: OperatingSystem,
        private readonly systemSettingRepository: SystemSettingRepository,
        private readonly assetPathResolver: AssetPathResolver,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        return this.systemSettingRepository.getAll().map((s) => s.toSearchResultItem());
    }

    public isSupported(): boolean {
        return (<OperatingSystem[]>["Windows", "macOS"]).includes(this.operatingSystem);
    }

    public getSettingDefaultValue() {
        return undefined;
    }

    public getImage(): Image {
        const filenames: Record<OperatingSystem, string> = {
            Linux: "", // not supported,
            macOS: "macos-system-settings.png",
            Windows: "windows-11-settings.png",
        };

        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, filenames[this.operatingSystem])}`,
        };
    }

    public getI18nResources() {
        return {
            "en-US": {
                extensionName: "System Settings",
            },
            "de-CH": {
                extensionName: "Systemeinstellungen",
            },
            "ja-JP": {
                extensionName: "システム設定",
            },
            "ko-KR": {
                extensionName: "시스템 설정",
            },
        };
    }
}
