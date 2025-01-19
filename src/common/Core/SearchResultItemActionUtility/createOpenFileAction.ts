import type { SearchResultItemAction } from "@common/Core";

/**
 * Creates an action to open the given file path.
 */
export const createOpenFileAction = ({
    filePath,
    description,
    descriptionTranslation,
    keyboardShortcut,
}: {
    filePath: string;
    description: string;
    descriptionTranslation?: { key: string; namespace: string };
    keyboardShortcut?: string;
}): SearchResultItemAction => ({
    argument: filePath,
    description,
    descriptionTranslation,
    handlerId: "OpenFilePath",
    fluentIcon: "OpenRegular",
    hideWindowAfterInvocation: true,
    keyboardShortcut,
});
