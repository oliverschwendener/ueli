import { type SearchResultItemAction, createCopyToClipboardAction } from "@common/Core";
import { describe, expect, it } from "vitest";

describe(createCopyToClipboardAction, () => {
    it("should create an 'copy to clipboard' action", () => {
        const actual = createCopyToClipboardAction({
            description: "test description",
            textToCopy: "text to copy",
            descriptionTranslation: {
                key: "translation key",
                namespace: "translation namespace",
            },
            keyboardShortcut: "test-keyboard-shortcut",
        });

        const expected = <SearchResultItemAction>{
            argument: "text to copy",
            description: "test description",
            descriptionTranslation: {
                key: "translation key",
                namespace: "translation namespace",
            },
            fluentIcon: "CopyRegular",
            handlerId: "copyToClipboard",
            keyboardShortcut: "test-keyboard-shortcut",
        };

        expect(actual).toEqual(expected);
    });
});
