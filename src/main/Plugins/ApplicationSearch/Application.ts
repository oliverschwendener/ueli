import type { SearchResultItem } from "@common/SearchResultItem";
import type { Searchable } from "@common/Searchable";

export class Application implements Searchable {
    public constructor(
        private readonly name: string,
        private readonly filePath: string,
        private readonly iconFilePath: string,
    ) {}

    public toSearchResultItem(): SearchResultItem {
        return {
            description: "Application",
            descriptionTranslationKey: "plugin[ApplicationSearch].searchResultItemDescription",
            id: this.getId(),
            name: this.name,
            imageUrl: `file://${this.iconFilePath}`,
            defaultAction: {
                argument: this.filePath,
                description: "Open application",
                descriptionTranslationKey: "plugin[ApplicationSearch].searchResultItem.defaultAction.openApplication",
                handlerId: "OpenFilePath",
                hideWindowAfterInvokation: true,
            },
            additionalActions: [
                {
                    argument: this.filePath,
                    description: "Show in file explorer",
                    descriptionTranslationKey:
                        "plugin[ApplicationSearch].searchResultItem.additionalAction.showInFileExplorer",
                    handlerId: "ShowItemInFileExplorer",
                    hideWindowAfterInvokation: true,
                },
            ],
        };
    }

    private getId(): string {
        return Buffer.from(this.filePath).toString("base64");
    }
}
