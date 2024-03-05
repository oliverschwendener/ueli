import type { FluentIcon } from "./FluentIcon";
import type { SearchResultItemAction } from "./SearchResultItemAction";

/**
 * A utility class for creating SearchResultItemActions.
 */
export class SearchResultItemActionUtility {
    /**
     * Creates an action to add the given SearchResultItem to the favorites by it's ID.
     */
    public static createAddToFavoritesAction({ id }: { id: string }): SearchResultItemAction {
        return {
            argument: JSON.stringify({ action: "Add", id }),
            description: "Add to favorites",
            descriptionTranslation: {
                key: "addToFavorites",
                namespace: "searchResultItemAction",
            },
            handlerId: "Favorites",
            hideWindowAfterInvocation: false,
            fluentIcon: "StarRegular",
        };
    }

    /**
     * Creates an action to remove the given SearchResultItem from the favorites by it's ID.
     */
    public static createRemoveFromFavoritesAction({ id }: { id: string }): SearchResultItemAction {
        return {
            argument: JSON.stringify({ action: "Remove", id }),
            description: "Remove from favorites",
            descriptionTranslation: {
                key: "removeFromFavorites",
                namespace: "searchResultItemAction",
            },
            handlerId: "Favorites",
            hideWindowAfterInvocation: false,
            fluentIcon: "StarOffRegular",
        };
    }

    /**
     * Creates an action to navigate to the given extension by it's ID.
     * When returned action is invoked, the UI will navigate to the extension's custom UI page.
     */
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

    /**
     * Creates an action to open the given file path.
     */
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

    /**
     * Creates an action to exclude the given SearchResultItem from the search results by it's ID.
     */
    public static createExcludeFromSearchResultsAction({ id }: { id: string }): SearchResultItemAction {
        return {
            argument: id,
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

    /**
     * Creates an action to open the given URL in the default browser.
     */
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

    /**
     * Creates an action to copy the given text to the clipboard.
     */
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

    /**
     * Creates an action to show the given file in the default file browser.
     */
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
