import type { SearchResultItem } from "@common/Core";

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
            imageUrl: `file://${this.iconFilePath}`,
            defaultAction: {
                argument: this.filePath,
                description: "Open application",
                descriptionTranslationKey:
                    "extension[ApplicationSearch].searchResultItem.defaultAction.openApplication",
                handlerId: "OpenFilePath",
                hideWindowAfterInvocation: true,
                fluentIcon: "OpenRegular",
            },
            additionalActions: [
                {
                    argument: this.filePath,
                    description: "Show in file explorer",
                    descriptionTranslationKey:
                        "extension[ApplicationSearch].searchResultItem.additionalAction.showInFileExplorer",
                    handlerId: "ShowItemInFileExplorer",
                    hideWindowAfterInvocation: true,
                    fluentIcon: "DocumentFolderRegular",
                },
                {
                    argument: this.filePath,
                    description: "Copy file path to clipboard",
                    descriptionTranslationKey:
                        "extension[ApplicationSearch].searchResultItem.additionalAction.copyFilePathToClipboard",
                    handlerId: "copyToClipboard",
                    hideWindowAfterInvocation: false,
                    fluentIcon: "ClipboardRegular",
                },
            ],
        };
    }

    private getId(): string {
        return Buffer.from(this.filePath).toString("base64");
    }
}
