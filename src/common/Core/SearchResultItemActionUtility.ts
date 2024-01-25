import type { ExcludedSearchResultItem } from "./ExcludedSearchResultItem";
import type { SearchResultItemAction } from "./SearchResultItemAction";

export class SearchResultItemActionUtility {
    public static createOpenFileAction({
        filePath,
        description,
        descriptionTranslationKey,
    }: {
        filePath: string;
        description: string;
        descriptionTranslationKey?: string;
    }): SearchResultItemAction {
        return {
            argument: filePath,
            description,
            descriptionTranslationKey,
            handlerId: "OpenFilePath",
            hideWindowAfterInvocation: true,
            fluentIcon: "OpenRegular",
        };
    }

    public static createExcludeFromSearchResultsAction({
        id,
        name,
        imageUrl,
    }: {
        id: string;
        name: string;
        imageUrl?: string;
    }): SearchResultItemAction {
        return {
            argument: JSON.stringify(<ExcludedSearchResultItem>{ id, name, imageUrl }),
            description: "Exclude from search results",
            descriptionTranslationKey: "searchResultItem.action.excludeFromSearchResults",
            handlerId: "excludeFromSearchResults",
            hideWindowAfterInvocation: false,
            fluentIcon: "EyeOffRegular",
        };
    }

    public static createOpenUrlSearchResultAction({ url }: { url: string }): SearchResultItemAction {
        return {
            argument: url,
            description: "Open URL in browser",
            descriptionTranslationKey: "searchResultItem.action.openUrlInBrowser",
            handlerId: "Url",
            hideWindowAfterInvocation: true,
            fluentIcon: "OpenRegular",
        };
    }

    public static createCopyToClipboardAction({
        textToCopy,
        description,
        descriptionTranslationKey,
    }: {
        textToCopy: string;
        description: string;
        descriptionTranslationKey?: string;
    }): SearchResultItemAction {
        return {
            argument: textToCopy,
            description,
            descriptionTranslationKey,
            handlerId: "copyToClipboard",
            hideWindowAfterInvocation: false,
            fluentIcon: "CopyRegular",
        };
    }

    public static createShowItemInFileExplorerAction({ filePath }: { filePath: string }): SearchResultItemAction {
        return {
            argument: filePath,
            description: "Show in file explorer",
            descriptionTranslationKey: "searchResultItem.action.showInFileExplorer",
            handlerId: "ShowItemInFileExplorer",
            hideWindowAfterInvocation: true,
            fluentIcon: "DocumentFolderRegular",
        };
    }
}
