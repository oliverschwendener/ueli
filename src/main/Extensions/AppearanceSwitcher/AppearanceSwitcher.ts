import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { Translator } from "@Core/Translator";
import type { OperatingSystem, SearchResultItem } from "@common/Core";
import { resources } from "./resources";

export class AppearanceSwitcher implements Extension {
    public readonly id = "AppearanceSwitcher";
    public readonly name = "Appearance Switcher";
    public readonly nameTranslationKey = "extension[AppearanceSwitcher].extensionName";

    public readonly author = {
        name: "Oliver Schwendener",
        githubUserName: "oliverschwendener",
    };

    public constructor(
        private readonly currentOperatingSystem: OperatingSystem,
        private readonly assetPathResolver: AssetPathResolver,
        private readonly translator: Translator,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const t = await this.translator.createInstance(resources);

        return [
            {
                description: t("searchResultItem.description"),
                id: "AppearanceSwitcher:toggle",
                name: t("searchResultItem.name"),
                imageUrl: this.getSearchResultItemImageUrl(),
                defaultAction: {
                    argument: "toggle",
                    description: t("searchResultItem.actionDescription"),
                    handlerId: "AppearanceSwitcher",
                    hideWindowAfterInvocation: false,
                },
            },
        ];
    }

    public getSettingDefaultValue<T>(): T {
        return undefined as T;
    }

    public isSupported(): boolean {
        const supportedOperatingSystems: OperatingSystem[] = ["Windows", "macOS"];
        return supportedOperatingSystems.includes(this.currentOperatingSystem);
    }

    public getSettingKeysTriggeringRescan() {
        return ["general.language"];
    }

    public getImageUrl(): string {
        return this.getSearchResultItemImageUrl();
    }

    private getSearchResultItemImageUrl(): string {
        const map = {
            macOS: "macos-toggle-appearance-2.png",
            Windows: "windows-11-logo.webp",
        };

        return `file://${this.assetPathResolver.getExtensionAssetPath(this.id, map[this.currentOperatingSystem])}`;
    }
}
