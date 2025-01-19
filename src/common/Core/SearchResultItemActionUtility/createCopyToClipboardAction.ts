import type { SearchResultItemAction } from "@common/Core";

/**
 * Creates an action to copy the given text to the clipboard.
 */
export const createCopyToClipboardAction = ({
    textToCopy,
    description,
    descriptionTranslation,
    keyboardShortcut,
}: {
    textToCopy: string;
    description: string;
    descriptionTranslation?: { key: string; namespace: string };
    keyboardShortcut?: string;
}): SearchResultItemAction => ({
    argument: textToCopy,
    description,
    descriptionTranslation,
    handlerId: "copyToClipboard",
    fluentIcon: "CopyRegular",
    keyboardShortcut,
});
