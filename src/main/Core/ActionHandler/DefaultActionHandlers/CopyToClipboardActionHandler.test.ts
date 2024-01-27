import type { SearchResultItemAction } from "@common/Core";
import type { Clipboard } from "electron";
import { describe, expect, it, vi } from "vitest";
import { CopyToClipboardActionHandler } from "./CopyToClipboardActionHandler";

describe(CopyToClipboardActionHandler, () => {
    it("should write text to the clipboard", () => {
        const writeTextMock = vi.fn();
        const clipboard = <Clipboard>{ writeText: (text) => writeTextMock(text) };

        const actionHandler = new CopyToClipboardActionHandler(clipboard);
        actionHandler.invokeAction(<SearchResultItemAction>{ argument: "text to copy" });

        expect(actionHandler.id).toEqual("copyToClipboard");
        expect(writeTextMock).toHaveBeenCalledWith("text to copy");
    });
});
