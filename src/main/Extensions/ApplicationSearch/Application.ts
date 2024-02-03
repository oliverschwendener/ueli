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
            descriptionTranslation: {
                key: "searchResultItemDescription",
                namespace: "extension[ApplicationSearch]",
            },
            id: this.getId(),
            name: this.name,
            imageUrl: this.getImageUrl(),
            defaultAction: SearchResultItemActionUtility.createOpenFileAction({
                filePath: this.filePath,
                description: "Open application",
                descriptionTranslation: {
                    key: "openApplication",
                    namespace: "extension[ApplicationSearch]",
                },
            }),
            additionalActions: [
                SearchResultItemActionUtility.createShowItemInFileExplorerAction({ filePath: this.filePath }),
                SearchResultItemActionUtility.createCopyToClipboardAction({
                    textToCopy: this.filePath,
                    description: "Copy file path to clipboard",
                    descriptionTranslation: {
                        key: "copyFilePathToClipboard",
                        namespace: "extension[ApplicationSearch]",
                    },
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
