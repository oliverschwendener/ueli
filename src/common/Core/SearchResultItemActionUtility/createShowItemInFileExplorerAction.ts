import type { SearchResultItemAction } from "../SearchResultItemAction";

/**
 * Creates an action to show the given file in the default file browser.
 */
export const createShowItemInFileExplorerAction = ({ filePath }: { filePath: string }): SearchResultItemAction => ({
    argument: filePath,
    description: "Show in file explorer",
    descriptionTranslation: {
        key: "showInFileExplorer",
        namespace: "searchResultItemAction",
    },
    handlerId: "ShowItemInFileExplorer",
    fluentIcon: "DocumentFolderRegular",
    hideWindowAfterInvocation: true,
});
