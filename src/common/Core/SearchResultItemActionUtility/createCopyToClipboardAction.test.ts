import { describe, expect, it } from "vitest";
import type { SearchResultItemAction } from "../SearchResultItemAction";
import { createCopyToClipboardAction } from "./createCopyToClipboardAction";

describe(createCopyToClipboardAction, () => {
    it("should create an 'copy to clipboard' action", () => {
        const actual = createCopyToClipboardAction({
            description: "test description",
            textToCopy: "text to copy",
            descriptionTranslation: {
                key: "translation key",
                namespace: "translation namespace",
            },
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
        };

        expect(actual).toEqual(expected);
    });
});
