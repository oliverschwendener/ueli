import type { SearchResultItemAction } from "@common/Core";

/**
 * Creates an action to copy the given text to the clipboard.
 */
export const createCopyToClipboardAction = ({
    textToCopy,
    description,
    descriptionTranslation,
}: {
    textToCopy: string;
    description: string;
    descriptionTranslation?: { key: string; namespace: string };
}): SearchResultItemAction => ({
    argument: textToCopy,
    description,
    descriptionTranslation,
    handlerId: "copyToClipboard",
    fluentIcon: "CopyRegular",
    keyboardShortcut: "Ctrl+c",
});
