import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { OperatingSystem, SearchResultItem } from "@common/Core";
import type { MacOsSystemSettingRepository } from "./MacOsSystemSettingRepository";

export class SystemSettingsExtension implements Extension {
    public readonly id = "SystemSettings";
    public readonly name = "System Settings";
    public readonly nameTranslationKey = "extension[SystemSettings].extensionName";

    public readonly author = {
        name: "Oliver Schwendener",
        githubUserName: "oliverschwendener",
    };

    public constructor(
        private readonly currentOperatingSystem: OperatingSystem,
        private readonly macOsSystemSettingRepository: MacOsSystemSettingRepository,
        private readonly assetPathResolver: AssetPathResolver,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        return this.macOsSystemSettingRepository.getAll().map((s) => s.toSearchResultItem());
    }

    public isSupported(): boolean {
        return this.currentOperatingSystem === "macOS";
    }

    public getSettingDefaultValue<T>(): T {
        return undefined;
    }

    public getImageUrl(): string {
        return `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "macos-system-settings.png")}`;
    }
}
