import { describe, expect, it, vi } from "vitest";
import type { TodoistActionManager } from "../Manager";
import { TodoistQuickAddActionHandler } from "./QuickAddActionHandler";

const createAction = (payload: unknown) => ({
    argument: JSON.stringify(payload),
    description: "",
    handlerId: "",
});

describe(TodoistQuickAddActionHandler, () => {
    it("delegates to action manager", async () => {
        const actionManager: Pick<TodoistActionManager, "quickAdd"> = {
            quickAdd: vi.fn().mockResolvedValue(undefined),
        };
        const handler = new TodoistQuickAddActionHandler(actionManager as TodoistActionManager);

        await handler.invokeAction(createAction({ text: "hello" }));

        expect(actionManager.quickAdd).toHaveBeenCalledWith("hello");
    });

    it("throws when argument lacks text", async () => {
        const actionManager: Pick<TodoistActionManager, "quickAdd"> = {
            quickAdd: vi.fn(),
        };
        const handler = new TodoistQuickAddActionHandler(actionManager as TodoistActionManager);

        await expect(handler.invokeAction(createAction({}))).rejects.toThrow(
            "Todoist quick add action requires a non-empty text argument.",
        );
        expect(actionManager.quickAdd).not.toHaveBeenCalled();
    });

    it("propagates errors from action manager", async () => {
        const actionManager: Pick<TodoistActionManager, "quickAdd"> = {
            quickAdd: vi.fn().mockRejectedValue(new Error("boom")),
        };
        const handler = new TodoistQuickAddActionHandler(actionManager as TodoistActionManager);

        await expect(handler.invokeAction(createAction({ text: "hello" }))).rejects.toThrow("boom");
    });
});
