import type { SearchResultItemAction } from "@common/Core";
import type { Logger } from "@Core/Logger";
import { describe, expect, it, vi } from "vitest";
import type { TodoistActionManager } from "../Manager";
import { TodoistRefreshCachesActionHandler } from "./RefreshCachesActionHandler";

const createLogger = (): Logger => ({
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
});

describe(TodoistRefreshCachesActionHandler, () => {
    it("delegates to action manager", async () => {
        const actionManager: Pick<TodoistActionManager, "refreshCaches"> = {
            refreshCaches: vi.fn().mockResolvedValue(undefined),
        };
        const handler = new TodoistRefreshCachesActionHandler(actionManager as TodoistActionManager, createLogger());

        const action: SearchResultItemAction = {
            handlerId: "",
            description: "",
            argument: JSON.stringify({ searchTerm: "tdl work" }),
        };

        await handler.invokeAction(action);

        expect(actionManager.refreshCaches).toHaveBeenCalledWith("tdl work");
    });

    it("logs error when action manager rejects", async () => {
        const logger = createLogger();
        const actionManager: Pick<TodoistActionManager, "refreshCaches"> = {
            refreshCaches: vi.fn().mockRejectedValue(new Error("boom")),
        };
        const handler = new TodoistRefreshCachesActionHandler(actionManager as TodoistActionManager, logger);

        const action: SearchResultItemAction = {
            handlerId: "",
            description: "",
            argument: JSON.stringify({ searchTerm: "tdl" }),
        };

        await handler.invokeAction(action);

        expect(logger.error).toHaveBeenCalledWith("Todoist task reload failed. Reason: boom");
    });

    it("throws on invalid argument", async () => {
        const actionManager: Pick<TodoistActionManager, "refreshCaches"> = {
            refreshCaches: vi.fn(),
        };
        const handler = new TodoistRefreshCachesActionHandler(actionManager as TodoistActionManager, createLogger());

        const action: SearchResultItemAction = {
            handlerId: "",
            description: "",
            argument: JSON.stringify({ searchTerm: 1 }),
        };

        await expect(handler.invokeAction(action)).rejects.toThrow(
            "Todoist refresh caches action requires a searchTerm string argument.",
        );
        expect(actionManager.refreshCaches).not.toHaveBeenCalled();
    });
});
