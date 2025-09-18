import type { BrowserWindowNotifier } from "@Core/BrowserWindowNotifier";
import { describe, expect, it, vi } from "vitest";
import { TodoistSetSearchTermActionHandler } from "./TodoistSetSearchTermActionHandler";

const createAction = (newSearchTerm: unknown) => ({
    argument: JSON.stringify({ newSearchTerm }),
    description: "",
    handlerId: "",
});

describe(TodoistSetSearchTermActionHandler, () => {
    it("指定された検索語を通知する", async () => {
        const browserWindowNotifier: BrowserWindowNotifier = {
            notify: vi.fn(),
            notifyAll: vi.fn(),
        };

        const handler = new TodoistSetSearchTermActionHandler(browserWindowNotifier);

        await handler.invokeAction(createAction("todo buy milk"));

        expect(browserWindowNotifier.notify).toHaveBeenCalledWith({
            browserWindowId: "search",
            channel: "setSearchTerm",
            data: "todo buy milk",
        });
    });

    it("不正な引数で例外を送出する", async () => {
        const browserWindowNotifier: BrowserWindowNotifier = {
            notify: vi.fn(),
            notifyAll: vi.fn(),
        };

        const handler = new TodoistSetSearchTermActionHandler(browserWindowNotifier);

        await expect(
            handler.invokeAction({ argument: JSON.stringify({}), description: "", handlerId: "" }),
        ).rejects.toThrow();
    });
});
