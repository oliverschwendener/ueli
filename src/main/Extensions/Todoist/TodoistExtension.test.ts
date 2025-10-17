import type { InstantSearchResultItems } from "@common/Core";
import type { Logger } from "@Core/Logger";
import type { SettingsManager } from "@Core/SettingsManager";
import type { TaskScheduler } from "@Core/TaskScheduler";
import type { Translator } from "@Core/Translator";
import { describe, expect, it, vi } from "vitest";
import type { TodoistActionManager } from "./Actions";
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

        const todoistApiFactory = {
            create: vi.fn().mockReturnValue({
                getLabels: vi.fn().mockResolvedValue({ results: [], nextCursor: null }),
                getProjects: vi.fn().mockResolvedValue({ results: [], nextCursor: null }),
                getTasks: vi.fn().mockResolvedValue({ results: [], nextCursor: null }),
                getTasksByFilter: vi.fn().mockResolvedValue({ results: [], nextCursor: null }),
                quickAddTask: vi.fn(),
            }),
        };
        const cacheManager = new TodoistCacheManager(settingsManager, taskScheduler, todoistApiFactory, logger);

        const image = { url: "file:///todoist.svg" };

        const quickAddProvider = new TodoistQuickAddProvider(cacheManager, settingsManager, translator, image);
        const actionManagerStub: Pick<TodoistActionManager, "refreshTasksInBackground" | "requestSearchRefresh"> = {
            refreshTasksInBackground: vi.fn(),
            requestSearchRefresh: vi.fn(),
        };
        const taskListProvider = new TodoistTaskListProvider(
            cacheManager,
            settingsManager,
            translator,
            image,
            actionManagerStub as unknown as TodoistActionManager,
        );
        const extension = new TodoistExtension(image, cacheManager, quickAddProvider, taskListProvider);

        return {
            extension,
            cacheManager,
            quickAddProvider,
            taskListProvider,
        };
    };

    it("merges quick add results with task list results", () => {
        const { extension, quickAddProvider, taskListProvider } = setup();
        const quickAddResult = createInstantResult(1, 0);
        const taskListResult = createInstantResult(0, 1);
        vi.spyOn(quickAddProvider, "createItems").mockReturnValue(quickAddResult);
        vi.spyOn(taskListProvider, "createItems").mockReturnValue(taskListResult);

        const result = extension.getInstantSearchResultItems("todo buy milk");

        expect(result.before).toHaveLength(quickAddResult.before.length + taskListResult.before.length);
        expect(result.after).toHaveLength(quickAddResult.after.length + taskListResult.after.length);
        expect(taskListProvider.createItems).toHaveBeenCalledWith("todo buy milk");
    });

    it("returns empty result when providers return no items", () => {
        const { extension, quickAddProvider, taskListProvider } = setup();
        const quickAddResult = createInstantResult(0, 0);
        vi.spyOn(quickAddProvider, "createItems").mockReturnValue(quickAddResult);
        vi.spyOn(taskListProvider, "createItems").mockReturnValue(createInstantResult(0, 0));

        const result = extension.getInstantSearchResultItems("todo");

        expect(result.before).toHaveLength(0);
        expect(result.after).toHaveLength(0);
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
        await extension.reloadTasks();

        expect(cacheManager.refreshAllCaches).toHaveBeenCalled();
        expect(cacheManager.refreshTasks).toHaveBeenCalled();
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
