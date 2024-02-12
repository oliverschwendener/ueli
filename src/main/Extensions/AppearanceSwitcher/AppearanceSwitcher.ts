import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { Translator } from "@Core/Translator";
import type { OperatingSystem, SearchResultItem } from "@common/Core";
import type { Translations } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import { translations } from "./translations";

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
        const t = await this.translator.createInstance(translations);

        return [
            {
                description: t("searchResultItem.description"),
                id: "AppearanceSwitcher:toggle",
                name: t("searchResultItem.name"),
                image: this.getImage(),
                defaultAction: {
                    argument: "toggle",
                    description: t("searchResultItem.actionDescription"),
                    handlerId: "AppearanceSwitcher",
                    hideWindowAfterInvocation: false,
                    fluentIcon: "ToggleMultipleRegular",
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

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "switch-to-light-mode.png")}`,
            urlOnDarkBackground: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "switch-to-light-mode.png")}`,
            urlOnLightBackground: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "switch-to-dark-mode.png")}`,
        };
    }

    public getTranslations(): Translations {
        return translations;
    }
}
