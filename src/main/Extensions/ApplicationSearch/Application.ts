import type { SearchResultItem } from "@common/Core";
import { SearchResultItemActionUtility } from "@common/Core";
import type { Image } from "@common/Core/Image";

export class Application {
    public constructor(
        private readonly name: string,
        private readonly filePath: string,
        private readonly image: Image,
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
            image: this.image,
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
}
