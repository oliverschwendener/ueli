import type { SearchResultItem } from "@common/SearchResultItem";
import type { Extension } from "@Core/Extension";

export class UeliCommandExtension implements Extension {
    public id = "UeliCommand";
    public name = "Ueli Commands";
    public nameTranslationKey? = "extension[UeliCommand].extensionName";

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const baseImageUrl = `file://${__dirname}/../assets`;

        const imageUrls = {
            neutral: `${baseImageUrl}/windows-app-icon-dark-background.png`,
            onDarkBackground: `${baseImageUrl}/ueli-icon-white-on-transparent.png`,
            onLightBackground: `${baseImageUrl}/ueli-icon-black-on-transparent.png`,
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
