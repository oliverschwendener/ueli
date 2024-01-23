import type { Extension } from "@Core/Extension";
import type { OperatingSystem, SearchResultItem } from "@common/Core";
import { MacOsSystemSettingRepository } from "./MacOsSystemSettingRepository";

export class SystemSettingsExtension implements Extension {
    public readonly id = "SystemSettings";
    public readonly name = "System Settings";
    public readonly nameTranslationKey = "extension[SystemSettings].extensionName";

    public constructor(
        private readonly currentOperatingSystem: OperatingSystem,
        private readonly macOsSystemSettingRepository: MacOsSystemSettingRepository,
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
}
