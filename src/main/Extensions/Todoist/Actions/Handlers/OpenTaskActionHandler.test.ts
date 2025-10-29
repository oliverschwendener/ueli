import { describe, expect, it, vi } from "vitest";
import type { TodoistActionManager } from "../Manager";
import { TodoistOpenTaskActionHandler } from "./OpenTaskActionHandler";

const createAction = (payload: unknown) => ({
    argument: JSON.stringify(payload),
    description: "",
    handlerId: "",
});

describe(TodoistOpenTaskActionHandler, () => {
    it("delegates to action manager", async () => {
        const actionManager: Pick<TodoistActionManager, "openTask"> = {
            openTask: vi.fn().mockResolvedValue(undefined),
        };
        const handler = new TodoistOpenTaskActionHandler(actionManager as TodoistActionManager);

        const payload = {
            taskId: "task-1",
            webUrl: "https://app.todoist.com/app/task/1",
            desktopUrl: "todoist://task?id=1",
            searchTerm: "tdl",
        };

        await handler.invokeAction(createAction(payload));

        expect(actionManager.openTask).toHaveBeenCalledWith(payload);
    });

    it("throws when required fields are missing", async () => {
        const actionManager: Pick<TodoistActionManager, "openTask"> = {
            openTask: vi.fn(),
        };
        const handler = new TodoistOpenTaskActionHandler(actionManager as TodoistActionManager);

        await expect(handler.invokeAction(createAction({ taskId: "" }))).rejects.toThrow(
            "Todoist open task action requires a taskId string argument.",
        );
        expect(actionManager.openTask).not.toHaveBeenCalled();
    });

    it("propagates errors from action manager", async () => {
        const actionManager: Pick<TodoistActionManager, "openTask"> = {
            openTask: vi.fn().mockRejectedValue(new Error("oops")),
        };
        const handler = new TodoistOpenTaskActionHandler(actionManager as TodoistActionManager);

        await expect(
            handler.invokeAction(
                createAction({
                    taskId: "task-1",
                    webUrl: "https://app.todoist.com/app/task/1",
                    desktopUrl: "todoist://task?id=1",
                    searchTerm: "tdl",
                }),
            ),
        ).rejects.toThrow("oops");
    });
});
