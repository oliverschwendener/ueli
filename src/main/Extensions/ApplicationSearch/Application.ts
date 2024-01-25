import type { SearchResultItem } from "@common/Core";
import { SearchResultItemActionUtility } from "@common/Core";

export class Application {
    public constructor(
        private readonly name: string,
        private readonly filePath: string,
        private readonly iconFilePath: string,
    ) {}

    public toSearchResultItem(): SearchResultItem {
        return {
            description: "Application",
            descriptionTranslationKey: "extension[ApplicationSearch].searchResultItemDescription",
            id: this.getId(),
            name: this.name,
            imageUrl: this.getImageUrl(),
            defaultAction: SearchResultItemActionUtility.createOpenFileAction({
                filePath: this.filePath,
                description: "Open application",
                descriptionTranslationKey:
                    "extension[ApplicationSearch].searchResultItem.defaultAction.openApplication",
            }),
            additionalActions: [
                SearchResultItemActionUtility.createShowItemInFileExplorerAction({ filePath: this.filePath }),
                SearchResultItemActionUtility.createCopyToClipboardAction({
                    textToCopy: this.filePath,
                    description: "Copy file path to clipboard",
                    descriptionTranslationKey:
                        "extension[ApplicationSearch].searchResultItem.additionalAction.copyFilePathToClipboard",
                }),
                SearchResultItemActionUtility.createExcludeFromSearchResultsAction({
                    id: this.getId(),
                    name: this.name,
                    imageUrl: this.getImageUrl(),
                }),
            ],
        };
    }

    private getId(): string {
        return Buffer.from(`[ApplicationSearch][${this.filePath}]`).toString("base64");
    }

    private getImageUrl(): string {
        return `file://${this.iconFilePath}`;
    }
}
