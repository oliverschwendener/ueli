import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { Translator } from "@Core/Translator";
import type { OperatingSystem, SearchResultItem } from "@common/Core";
import type { Image } from "@common/Core/Image";

export class AppearanceSwitcher implements Extension {
    public readonly id = "AppearanceSwitcher";
    public readonly name = "Appearance Switcher";

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: "extension[AppearanceSwitcher]",
    };

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
        const { t } = this.translator.createT(this.getI18nResources());

        return [
            {
                description: t("searchResultItemDescription"),
                id: "AppearanceSwitcher:toggle",
                name: t("searchResultItemName"),
                image: this.getImage(),
                defaultAction: {
                    argument: "toggle",
                    description: t("searchResultItemActionDescription"),
                    handlerId: "AppearanceSwitcher",
                    fluentIcon: "ToggleMultipleRegular",
                },
            },
        ];
    }

    public getSettingDefaultValue() {
        return undefined;
    }

    public isSupported(): boolean {
        const supportedOperatingSystems: OperatingSystem[] = ["Windows", "macOS"];
        return supportedOperatingSystems.includes(this.currentOperatingSystem);
    }

    public getSettingKeysTriggeringRescan() {
        return ["general.language"];
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "switch-to-light-mode.png")}`,
            urlOnDarkBackground: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "switch-to-light-mode.png")}`,
            urlOnLightBackground: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "switch-to-dark-mode.png")}`,
        };
    }

    public getI18nResources() {
        return {
            "en-US": {
                extensionName: "Appearance Switcher",
                searchResultItemDescription: "System",
                searchResultItemName: "Toggle System Appearance",
                searchResultItemActionDescription: "Toggle System Appearance",
            },
            "de-CH": {
                extensionName: "Erscheinungsbildwechsler",
                searchResultItemDescription: "System",
                searchResultItemName: "System-Farbschema umschalten",
                searchResultItemActionDescription: "System-Farbschema umschalten",
            },
            "ja-JP": {
                extensionName: "OSアピアランス切り替え",
                searchResultItemDescription: "システム",
                searchResultItemName: "アピアランス切り替え | Toggle System Appearance",
                searchResultItemActionDescription: "OSのダークモード/ライトモードを切り替えます",
            },
            "ko-KR": {
                extensionName: "시스템 테마 전환기",
                searchResultItemDescription: "시스템",
                searchResultItemName: "시스템 테마 전환",
                searchResultItemActionDescription: "시스템 테마 전환",
            },
        };
    }
}
