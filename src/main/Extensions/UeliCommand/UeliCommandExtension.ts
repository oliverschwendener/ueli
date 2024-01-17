import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { Translator } from "@Core/Translator";
import type { UeliCommand } from "@Core/UeliCommand";
import type { SearchResultItem } from "@common/Core";
import { resources } from "./resources";

type ImageUrlType = "neutral" | "onDarkBackground" | "onLightBackground";

export class UeliCommandExtension implements Extension {
    public readonly id = "UeliCommand";
    public readonly name = "Ueli Commands";
    public readonly nameTranslationKey? = "extension[UeliCommand].extensionName";
    public readonly settingKeysTriggeringReindex = ["general.language"];

    public constructor(
        private readonly assetPathResolver: AssetPathResolver,
        private readonly translator: Translator,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const t = await this.translator.createInstance(resources);

        const map: Record<string, SearchResultItem> = {
            quit: {
                id: "ueliCommand:quit",
                description: t("ueliCommand.description"),
                name: t("ueliCommand.quitUeli"),
                imageUrl: this.getSearchResultItemImageUrl("neutral"),
                imageUrlOnDarkBackground: this.getSearchResultItemImageUrl("onDarkBackground"),
                imageUrlOnLightBackground: this.getSearchResultItemImageUrl("onLightBackground"),
                defaultAction: {
                    handlerId: "UeliCommand",
                    argument: <UeliCommand>"quit",
                    description: t("ueliCommand.quitUeli"),
                    hideWindowAfterInvokation: false,
                    requiresConfirmation: true,
                    fluentIcon: "DismissCircleRegular",
                },
            },
            settings: {
                id: "ueliCommand:settings",
                description: t("ueliCommand.description"),
                name: t("ueliCommand.openSettings"),
                imageUrl: this.getSearchResultItemImageUrl("neutral"),
                imageUrlOnDarkBackground: this.getSearchResultItemImageUrl("onDarkBackground"),
                imageUrlOnLightBackground: this.getSearchResultItemImageUrl("onLightBackground"),
                defaultAction: {
                    handlerId: "UeliCommand",
                    argument: <UeliCommand>"settings",
                    description: t("ueliCommand.openSettings"),
                    hideWindowAfterInvokation: false,
                    fluentIcon: "SettingsRegular",
                },
            },
            extensions: {
                id: "ueliCommand:extensions",
                description: t("ueliCommand.description"),
                name: t("ueliCommand.openExtensions"),
                imageUrl: this.getSearchResultItemImageUrl("neutral"),
                imageUrlOnDarkBackground: this.getSearchResultItemImageUrl("onDarkBackground"),
                imageUrlOnLightBackground: this.getSearchResultItemImageUrl("onLightBackground"),
                defaultAction: {
                    handlerId: "UeliCommand",
                    argument: <UeliCommand>"extensions",
                    description: t("ueliCommand.openExtensions"),
                    hideWindowAfterInvokation: false,
                    fluentIcon: "AppsAddInRegular",
                },
            },
            centerWindow: {
                id: "ueliCommand:centerWindow",
                description: t("ueliCommand.description"),
                name: t("ueliCommand.centerWindow"),
                imageUrl: this.getSearchResultItemImageUrl("neutral"),
                imageUrlOnDarkBackground: this.getSearchResultItemImageUrl("onDarkBackground"),
                imageUrlOnLightBackground: this.getSearchResultItemImageUrl("onLightBackground"),
                defaultAction: {
                    handlerId: "UeliCommand",
                    argument: <UeliCommand>"centerWindow",
                    description: t("ueliCommand.centerWindow"),
                    hideWindowAfterInvokation: false,
                    fluentIcon: "AppsAddInRegular",
                },
            },
        };

        return Object.values(map);
    }

    private getSearchResultItemImageUrl(type: ImageUrlType): string {
        const fileName: Record<ImageUrlType, string> = {
            neutral: "windows-app-icon-dark-background.png",
            onDarkBackground: "ueli-icon-white-on-transparent.png",
            onLightBackground: "ueli-icon-black-on-transparent.png",
        };

        return `file://${this.assetPathResolver.getExtensionAssetPath(this.id, fileName[type])}`;
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue<T>(): T {
        return undefined as T;
    }
}
