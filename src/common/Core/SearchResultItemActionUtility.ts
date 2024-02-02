import type { ExcludedSearchResultItem } from "./ExcludedSearchResultItem";
import type { FluentIcon } from "./FluentIcon";
import type { SearchResultItemAction } from "./SearchResultItemAction";

export class SearchResultItemActionUtility {
    public static createInvokeExtensionAction({
        extensionId,
        description,
        fluentIcon,
    }: {
        extensionId: string;
        description: string;
        fluentIcon?: FluentIcon;
    }): SearchResultItemAction {
        return {
            argument: `/extension/${extensionId}`,
            description,
            handlerId: "navigateTo",
            hideWindowAfterInvocation: false,
            fluentIcon,
        };
    }

    public static createOpenFileAction({
        filePath,
        description,
        descriptionTranslation,
    }: {
        filePath: string;
        description: string;
        descriptionTranslation?: { key: string; namespace: string };
    }): SearchResultItemAction {
        return {
            argument: filePath,
            description,
            descriptionTranslation,
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
            descriptionTranslation: {
                key: "excludeFromSearchResults",
                namespace: "searchResultItemAction",
            },
            handlerId: "excludeFromSearchResults",
            hideWindowAfterInvocation: false,
            fluentIcon: "EyeOffRegular",
        };
    }

    public static createOpenUrlSearchResultAction({ url }: { url: string }): SearchResultItemAction {
        return {
            argument: url,
            description: "Open URL in browser",
            descriptionTranslation: {
                key: "openUrlInBrowser",
                namespace: "searchResultItemAction",
            },
            handlerId: "Url",
            hideWindowAfterInvocation: true,
            fluentIcon: "OpenRegular",
        };
    }

    public static createCopyToClipboardAction({
        textToCopy,
        description,
        descriptionTranslation,
    }: {
        textToCopy: string;
        description: string;
        descriptionTranslation?: { key: string; namespace: string };
    }): SearchResultItemAction {
        return {
            argument: textToCopy,
            description,
            descriptionTranslation,
            handlerId: "copyToClipboard",
            hideWindowAfterInvocation: false,
            fluentIcon: "CopyRegular",
        };
    }

    public static createShowItemInFileExplorerAction({ filePath }: { filePath: string }): SearchResultItemAction {
        return {
            argument: filePath,
            description: "Show in file explorer",
            descriptionTranslation: {
                key: "showInFileExplorer",
                namespace: "searchResultItemAction",
            },
            handlerId: "ShowItemInFileExplorer",
            hideWindowAfterInvocation: true,
            fluentIcon: "DocumentFolderRegular",
        };
    }
}
