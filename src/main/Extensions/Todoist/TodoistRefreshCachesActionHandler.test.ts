import type { SearchResultItemAction } from "@common/Core";
import type { Logger } from "@Core/Logger";
import { describe, expect, it, vi } from "vitest";
import { TodoistRefreshCachesActionHandler } from "./TodoistRefreshCachesActionHandler";

const createLogger = (): Logger => ({
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
});

describe(TodoistRefreshCachesActionHandler, () => {
    it("reloads tasks with provided search term", async () => {
        const reloadTasks = vi.fn().mockResolvedValue(undefined);
        const handler = new TodoistRefreshCachesActionHandler(reloadTasks, createLogger());

        const action: SearchResultItemAction = {
            handlerId: "",
            description: "",
            argument: JSON.stringify({ searchTerm: "tdl inbox" }),
        };

        await handler.invokeAction(action);

        expect(reloadTasks).toHaveBeenCalledWith("tdl inbox");
    });

    it("throws on invalid argument", async () => {
        const reloadTasks = vi.fn();
        const handler = new TodoistRefreshCachesActionHandler(reloadTasks, createLogger());

        const action: SearchResultItemAction = {
            handlerId: "",
            description: "",
            argument: JSON.stringify({ searchTerm: 123 }),
        };

        await expect(handler.invokeAction(action)).rejects.toThrow();
        expect(reloadTasks).not.toHaveBeenCalled();
    });
});
