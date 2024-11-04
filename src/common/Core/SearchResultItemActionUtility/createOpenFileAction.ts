import type { SearchResultItemAction } from "../SearchResultItemAction";

/**
 * Creates an action to open the given file path.
 */
export const createOpenFileAction = ({
    filePath,
    description,
    descriptionTranslation,
}: {
    filePath: string;
    description: string;
    descriptionTranslation?: { key: string; namespace: string };
}): SearchResultItemAction => ({
    argument: filePath,
    description,
    descriptionTranslation,
    handlerId: "OpenFilePath",
    fluentIcon: "OpenRegular",
    hideWindowAfterInvocation: true,
});
