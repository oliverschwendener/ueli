import type { Logger } from "@Core/Logger";
import type { SettingsManager } from "@Core/SettingsManager";
import type { TaskScheduler } from "@Core/TaskScheduler";
import { describe, expect, it, vi } from "vitest";
import { TodoistCacheManager } from "./CacheManager";

describe(TodoistCacheManager, () => {
    const createSettingsManager = (overrides?: Partial<Record<string, unknown>>): SettingsManager => {
        const map = new Map<string, unknown>();
        map.set("extension[Todoist].apiToken", overrides?.apiToken ?? "token");
        map.set("extension[Todoist].taskListLimit", overrides?.taskListLimit ?? 30);
        map.set("extension[Todoist].taskFilter", overrides?.taskFilter ?? "");

        return {
            getValue: <T>(key: string, defaultValue: T) => (map.has(key) ? (map.get(key) as T) : defaultValue),
            updateValue: vi.fn(),
        };
    };

    const createLogger = (): Logger => ({
        debug: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
    });

    const createTaskScheduler = (): TaskScheduler => ({
        scheduleTask: vi.fn(),
        abortTask: vi.fn(),
    });

    it("expires task cache after refreshAllCaches so next ensureTasks re-fetches", async () => {
        const getTasks = vi.fn().mockResolvedValue({ results: [], nextCursor: null });
        const getTasksByFilter = vi.fn().mockResolvedValue({ results: [], nextCursor: null });
        const getLabels = vi.fn().mockResolvedValue({ results: [], nextCursor: null });
        const getProjects = vi.fn().mockResolvedValue({ results: [], nextCursor: null });

        const todoistApiFactory = {
            create: vi.fn().mockReturnValue({
                getLabels,
                getProjects,
                getTasks,
                getTasksByFilter,
                quickAddTask: vi.fn(),
            }),
        };

        const cacheManager = new TodoistCacheManager(
            createSettingsManager(),
            createTaskScheduler(),
            todoistApiFactory,
            createLogger(),
        );

        // Initial entity refresh is scheduled on initialize
        cacheManager.initialize();

        // Simulate pressing Refresh in settings
        await cacheManager.refreshAllCaches();
        expect(getTasks).toHaveBeenCalledTimes(1);

        // Next task-list ensure should re-fetch because TTL was expired
        await cacheManager.ensureTasks();
        expect(getTasks).toHaveBeenCalledTimes(2);
    });
});
