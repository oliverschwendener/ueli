import type { EventEmitter } from "@Core/EventEmitter";
import type { SearchResultItemAction } from "@common/Core";
import type { Clipboard } from "electron";
import { describe, expect, it, vi } from "vitest";
import { CopyToClipboardActionHandler } from "./CopyToClipboardActionHandler";

describe(CopyToClipboardActionHandler, () => {
    it("should write text to the clipboard", () => {
        const writeTextMock = vi.fn();
        const emitEventMock = vi.fn();
        const clipboard = <Clipboard>{ writeText: (text) => writeTextMock(text) };
        const eventEmitter = <EventEmitter>{ emitEvent: (e) => emitEventMock(e) };

        const actionHandler = new CopyToClipboardActionHandler(clipboard, eventEmitter);
        actionHandler.invokeAction(<SearchResultItemAction>{ argument: "text to copy" });

        expect(actionHandler.id).toEqual("copyToClipboard");
        expect(writeTextMock).toHaveBeenCalledWith("text to copy");
        expect(emitEventMock).toHaveBeenCalledWith("copiedToClipboard");
    });
});
