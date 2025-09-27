import type { InstantSearchResultItems } from "@common/Core";
import type { Logger } from "@Core/Logger";
import type { SettingsManager } from "@Core/SettingsManager";
import type { TaskScheduler } from "@Core/TaskScheduler";
import type { Translator } from "@Core/Translator";
import { describe, expect, it, vi } from "vitest";
import { TodoistCacheManager } from "./Caching";
import { TodoistQuickAddProvider, TodoistTaskListProvider } from "./Search";
import { todoistDefaultSettings } from "./Shared";
import { TodoistExtension } from "./TodoistExtension";

const createSettingsManager = (overrides?: Partial<Record<string, unknown>>): SettingsManager => {
    const map = new Map<string, unknown>();

    map.set("extension[Todoist].quickAddPrefix", overrides?.quickAddPrefix ?? todoistDefaultSettings.quickAddPrefix);
    map.set("extension[Todoist].taskListPrefix", overrides?.taskListPrefix ?? todoistDefaultSettings.taskListPrefix);
    map.set("extension[Todoist].suggestionLimit", overrides?.suggestionLimit ?? todoistDefaultSettings.suggestionLimit);
    map.set("extension[Todoist].taskListLimit", overrides?.taskListLimit ?? todoistDefaultSettings.taskListLimit);
    map.set("extension[Todoist].taskOpenTarget", overrides?.taskOpenTarget ?? todoistDefaultSettings.taskOpenTarget);
    map.set("extension[Todoist].taskFilter", overrides?.taskFilter ?? todoistDefaultSettings.taskFilter);
    map.set("extension[Todoist].apiToken", overrides?.apiToken ?? todoistDefaultSettings.apiToken);

    return {
        getValue: <T>(key: string, defaultValue: T) => (map.has(key) ? (map.get(key) as T) : defaultValue),
        updateValue: vi.fn(),
    };
};

describe(TodoistExtension, () => {
    const createTranslator = (): Translator => ({
        createT: () => ({
            t: (key: string) => key,
        }),
    });

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

    const createInstantResult = (beforeLength: number, afterLength: number): InstantSearchResultItems => ({
        before: Array.from({ length: beforeLength }, (_, index) => ({
            id: `before-${index}`,
        })) as InstantSearchResultItems["before"],
        after: Array.from({ length: afterLength }, (_, index) => ({
            id: `after-${index}`,
        })) as InstantSearchResultItems["after"],
    });

    const setup = () => {
        const settingsManager = createSettingsManager();
        const translator = createTranslator();
        const taskScheduler = createTaskScheduler();
        const logger = createLogger();
        const browserWindowNotifier = {
            notify: vi.fn(),
            notifyAll: vi.fn(),
        };

        const todoistApiFactory = {
            create: vi.fn().mockReturnValue({
                getLabels: vi.fn().mockResolvedValue({ results: [], nextCursor: null }),
                getProjects: vi.fn().mockResolvedValue({ results: [], nextCursor: null }),
                getTasks: vi.fn().mockResolvedValue({ results: [], nextCursor: null }),
                getTasksByFilter: vi.fn().mockResolvedValue({ results: [], nextCursor: null }),
                quickAddTask: vi.fn(),
            }),
        };
        const cacheManager = new TodoistCacheManager(
            settingsManager,
            taskScheduler,
            todoistApiFactory,
            logger,
            browserWindowNotifier,
        );

        const image = { url: "file:///todoist.svg" };

        const quickAddProvider = new TodoistQuickAddProvider(cacheManager, settingsManager, translator, image);
        const taskListProvider = new TodoistTaskListProvider(cacheManager, settingsManager, translator, image);
        const extension = new TodoistExtension(image, cacheManager, quickAddProvider, taskListProvider);

        return {
            extension,
            cacheManager,
            quickAddProvider,
            taskListProvider,
        };
    };

    it("prefers quick add results when available", () => {
        const { extension, quickAddProvider, taskListProvider } = setup();
        vi.spyOn(quickAddProvider, "createItems").mockReturnValue(createInstantResult(1, 0));
        vi.spyOn(taskListProvider, "createItems").mockReturnValue(createInstantResult(0, 1));

        const result = extension.getInstantSearchResultItems("todo buy milk");

        expect(result.before).toHaveLength(1);
        expect(taskListProvider.createItems).not.toHaveBeenCalled();
    });

    it("falls back to task list when quick add empty", () => {
        const { extension, quickAddProvider, taskListProvider } = setup();
        vi.spyOn(quickAddProvider, "createItems").mockReturnValue(createInstantResult(0, 0));
        vi.spyOn(taskListProvider, "createItems").mockReturnValue(createInstantResult(0, 2));

        const result = extension.getInstantSearchResultItems("tdl inbox");

        expect(result.after).toHaveLength(2);
        expect(taskListProvider.createItems).toHaveBeenCalledWith("tdl inbox");
    });

    it("delegates refresh operations to cache manager", async () => {
        const { extension, cacheManager } = setup();
        vi.spyOn(cacheManager, "refreshAllCaches").mockResolvedValue(undefined);
        vi.spyOn(cacheManager, "refreshTasks").mockResolvedValue(undefined);

        await extension.refreshAllCaches();
        await extension.reloadTasks("tdl");

        expect(cacheManager.refreshAllCaches).toHaveBeenCalled();
        expect(cacheManager.refreshTasks).toHaveBeenCalledWith("tdl");
    });

    it("delegates task issue reporting", () => {
        const { extension, cacheManager } = setup();
        vi.spyOn(cacheManager, "reportTaskIssue").mockImplementation(() => undefined);

        extension.reportTaskOpenIssue({ searchTerm: "tdl", message: "error" });

        expect(cacheManager.reportTaskIssue).toHaveBeenCalledWith({ searchTerm: "tdl", message: "error" });
    });

    it("handles refreshCaches invocation", async () => {
        const { extension, cacheManager } = setup();
        vi.spyOn(cacheManager, "refreshAllCaches").mockResolvedValue(undefined);

        const result = await extension.invoke({ type: "refreshCaches" });
        expect(result).toEqual({ status: "ok" });
        expect(cacheManager.refreshAllCaches).toHaveBeenCalled();
    });

    it("throws on unsupported invocation", async () => {
        const { extension } = setup();

        await expect(extension.invoke({ type: "unknown" })).rejects.toThrow(
            "Unsupported Todoist extension invocation type",
        );
    });

    it("returns default setting values", () => {
        const { extension } = setup();
        expect(extension.getSettingDefaultValue("quickAddPrefix")).toBe(todoistDefaultSettings.quickAddPrefix);
    });
});
