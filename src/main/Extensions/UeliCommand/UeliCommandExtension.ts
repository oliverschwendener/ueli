import type { Extension } from "@Core/Extension";
import type { ExtensionAssetPathResolver } from "@Core/ExtensionAssets";
import type { SearchResultItem } from "@common/SearchResultItem";
import { init } from "i18next";
import { resources } from "./resources";

type ImageUrlType = "neutral" | "onDarkBackground" | "onLightBackground";

export class UeliCommandExtension implements Extension {
    public id = "UeliCommand";
    public name = "Ueli Commands";
    public nameTranslationKey? = "extension[UeliCommand].extensionName";

    public constructor(private readonly extensionAssetPathResolver: ExtensionAssetPathResolver) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const t = await init({ resources });

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
                    argument: "quit",
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
                    argument: "settings",
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
                    argument: "extensions",
                    description: t("ueliCommand.openExtensions"),
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

        return `file://${this.extensionAssetPathResolver.getAssetFilePath(this.id, fileName[type])}`;
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue<T>(): T {
        return undefined as T;
    }
}
