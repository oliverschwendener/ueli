import type { SearchResultItem } from "@common/SearchResultItem";
import type { Extension } from "@Core/Extension";
import type { ExtensionAssetPathResolver } from "@Core/ExtensionAssets";

export class UeliCommandExtension implements Extension {
    public id = "UeliCommand";
    public name = "Ueli Commands";
    public nameTranslationKey? = "extension[UeliCommand].extensionName";

    public constructor(private readonly extensionAssetPathResolver: ExtensionAssetPathResolver) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const imageUrls = {
            neutral: `file://${this.extensionAssetPathResolver.getAssetFilePath(
                this.id,
                "windows-app-icon-dark-background.png",
            )}`,
            onDarkBackground: `file://${this.extensionAssetPathResolver.getAssetFilePath(
                this.id,
                "ueli-icon-white-on-transparent.png",
            )}`,
            onLightBackground: `file://${this.extensionAssetPathResolver.getAssetFilePath(
                this.id,
                "ueli-icon-black-on-transparent.png",
            )}`,
        };

        const map: Record<string, SearchResultItem> = {
            quit: {
                id: "ueliCommand:quit",
                description: "Ueli Command",
                descriptionTranslationKey: "extension[UeliCommand].searchResultDescription",
                name: "Quit Ueli",
                nameTranslationKey: "extension[UeliCommand].quitUeli",
                imageUrl: imageUrls.neutral,
                imageUrlOnDarkBackground: imageUrls.onDarkBackground,
                imageUrlOnLightBackground: imageUrls.onLightBackground,
                defaultAction: {
                    handlerId: "UeliCommand",
                    argument: "quit",
                    description: "Quit Ueli",
                    descriptionTranslationKey: "extension[UeliCommand].quitUeli",
                    hideWindowAfterInvokation: false,
                    requiresConfirmation: true,
                    fluentIcon: "DismissCircleRegular",
                },
            },
            settings: {
                id: "ueliCommand:settings",
                description: "Ueli Command",
                descriptionTranslationKey: "extension[UeliCommand].searchResultDescription",
                name: "Open Ueli Settings",
                nameTranslationKey: "extension[UeliCommand].openSettings",
                imageUrl: imageUrls.neutral,
                imageUrlOnDarkBackground: imageUrls.onDarkBackground,
                imageUrlOnLightBackground: imageUrls.onLightBackground,
                defaultAction: {
                    handlerId: "UeliCommand",
                    argument: "settings",
                    description: "Open Ueli settings",
                    descriptionTranslationKey: "extension[UeliCommand].openSettings",
                    hideWindowAfterInvokation: false,
                    fluentIcon: "SettingsRegular",
                },
            },
            extensions: {
                id: "ueliCommand:extensions",
                description: "Ueli Command",
                descriptionTranslationKey: "extension[UeliCommand].searchResultDescription",
                name: "Open Ueli Extensions",
                nameTranslationKey: "extension[UeliCommand].openExtensions",
                imageUrl: imageUrls.neutral,
                imageUrlOnDarkBackground: imageUrls.onDarkBackground,
                imageUrlOnLightBackground: imageUrls.onLightBackground,
                defaultAction: {
                    handlerId: "UeliCommand",
                    argument: "extensions",
                    description: "Open Ueli extensions",
                    descriptionTranslationKey: "extension[UeliCommand].openExtensions",
                    hideWindowAfterInvokation: false,
                    fluentIcon: "AppsAddInRegular",
                },
            },
        };

        return Object.values(map);
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue<T>(): T {
        return undefined as T;
    }
}
