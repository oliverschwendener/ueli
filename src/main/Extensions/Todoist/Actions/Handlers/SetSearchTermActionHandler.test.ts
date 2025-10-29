import type { BrowserWindowNotifier } from "@Core/BrowserWindowNotifier";
import { describe, expect, it, vi } from "vitest";
import { TodoistSetSearchTermActionHandler } from "./SetSearchTermActionHandler";

const createAction = (newSearchTerm: unknown) => ({
    argument: JSON.stringify({ newSearchTerm }),
    description: "",
    handlerId: "",
});

describe(TodoistSetSearchTermActionHandler, () => {
    it("notifies the provided search term", async () => {
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

    it("throws when argument is invalid", async () => {
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
