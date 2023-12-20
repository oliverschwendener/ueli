import type { SearchResultItem } from "@common/SearchResultItem";
import type { Extension } from "../../Extension";
import type { UeliCommand } from "./UeliCommand";

export class UeliCommandExtension implements Extension {
    public id = "UeliCommand";
    public name = "Ueli Commands";
    public nameTranslationKey? = "extension[UeliCommand].extensionName";

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const imageUrl = `file://${__dirname}/../assets/windows-app-icon-dark-background.png`;

        const map: Record<UeliCommand, SearchResultItem> = {
            quit: {
                id: "ueliCommand:quit",
                description: "Ueli Command",
                descriptionTranslationKey: "extension[UeliCommand].searchResultDescription",
                name: "Quit Ueli",
                nameTranslationKey: "extension[UeliCommand].quitUeli",
                imageUrl,
                defaultAction: {
                    handlerId: "UeliCommand",
                    argument: "quit",
                    description: "Quit Ueli",
                    descriptionTranslationKey: "extension[UeliCommand].quitUeli",
                    hideWindowAfterInvokation: false,
                },
            },
            settings: {
                id: "ueliCommand:settings",
                description: "Ueli Command",
                descriptionTranslationKey: "extension[UeliCommand].searchResultDescription",
                name: "Open Ueli Settings",
                nameTranslationKey: "extension[UeliCommand].openSettings",
                imageUrl,
                defaultAction: {
                    handlerId: "UeliCommand",
                    argument: "settings",
                    description: "Open Ueli settings",
                    descriptionTranslationKey: "extension[UeliCommand].openSettings",
                    hideWindowAfterInvokation: false,
                },
            },
        };

        return Object.values(map);
    }

    public isSupported(): boolean {
        return true;
    }
}
