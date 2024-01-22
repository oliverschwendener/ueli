import type { ExcludedSearchResultItem, SearchResultItem, SearchResultItemAction } from "@common/Core";

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
            defaultAction: this.getMainAction(),
            additionalActions: [
                this.getShowInFileExplorerAction(),
                this.getCopyFilePathToClipboardAction(),
                this.getExcludeFromSearchResultsAction(),
            ],
        };
    }

    private getId(): string {
        return Buffer.from(`[ApplicationSearch][${this.filePath}]`).toString("base64");
    }

    private getMainAction(): SearchResultItemAction {
        return {
            argument: this.filePath,
            description: "Open application",
            descriptionTranslationKey: "extension[ApplicationSearch].searchResultItem.defaultAction.openApplication",
            handlerId: "OpenFilePath",
            hideWindowAfterInvocation: true,
            fluentIcon: "OpenRegular",
        };
    }

    private getShowInFileExplorerAction(): SearchResultItemAction {
        return {
            argument: this.filePath,
            description: "Show in file explorer",
            descriptionTranslationKey:
                "extension[ApplicationSearch].searchResultItem.additionalAction.showInFileExplorer",
            handlerId: "ShowItemInFileExplorer",
            hideWindowAfterInvocation: true,
            fluentIcon: "DocumentFolderRegular",
        };
    }

    private getCopyFilePathToClipboardAction(): SearchResultItemAction {
        return {
            argument: this.filePath,
            description: "Copy file path to clipboard",
            descriptionTranslationKey:
                "extension[ApplicationSearch].searchResultItem.additionalAction.copyFilePathToClipboard",
            handlerId: "copyToClipboard",
            hideWindowAfterInvocation: false,
            fluentIcon: "ClipboardRegular",
        };
    }

    private getExcludeFromSearchResultsAction(): SearchResultItemAction {
        return {
            argument: JSON.stringify(<ExcludedSearchResultItem>{
                id: this.getId(),
                name: this.name,
                imageUrl: this.getImageUrl(),
            }),
            description: "Exclude from search results",
            descriptionTranslationKey: "searchResultItem.action.excludeFromSearchResults",
            handlerId: "excludeFromSearchResults",
            hideWindowAfterInvocation: false,
            fluentIcon: "EyeOffRegular",
        };
    }

    private getImageUrl(): string {
        return `file://${this.iconFilePath}`;
    }
}
