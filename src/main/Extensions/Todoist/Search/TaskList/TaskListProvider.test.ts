import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import type { Task } from "@doist/todoist-api-typescript";
import { describe, expect, it, vi } from "vitest";
import type { TodoistActionManager } from "../../Actions";
import type { TodoistCacheManager } from "../../Caching";
import type { TodoistTaskSnapshot } from "../../Shared";
import { getTodoistI18nResources } from "../../Shared";
import { TodoistTaskListProvider } from "./TaskListProvider";

const resources = getTodoistI18nResources();

const createTranslator = (): Translator => ({
    createT: () => ({
        t: (key: string) => {
            const dictionary = resources["en-US"] as Record<string, string>;
            return dictionary[key] ?? key;
        },
    }),
});

describe(TodoistTaskListProvider, () => {
    const createSettingsManager = (overrides?: {
        taskListPrefix?: string;
        taskListLimit?: number;
        taskOpenTarget?: string;
        taskFilter?: string;
        apiToken?: string;
    }): SettingsManager => {
        const map = new Map<string, unknown>();
        map.set("extension[Todoist].taskListPrefix", overrides?.taskListPrefix ?? "tdl");
        map.set("extension[Todoist].taskListLimit", overrides?.taskListLimit ?? 30);
        map.set("extension[Todoist].taskOpenTarget", overrides?.taskOpenTarget ?? "browser");
        map.set("extension[Todoist].taskFilter", overrides?.taskFilter ?? "");
        map.set("extension[Todoist].apiToken", overrides?.apiToken ?? "token");
        return {
            getValue: <T>(key: string, defaultValue: T) => (map.has(key) ? (map.get(key) as T) : defaultValue),
            updateValue: vi.fn(),
        };
    };

    const createCacheManager = ({
        snapshot,
        issues = [],
        hasToken = true,
    }: {
        snapshot: TodoistTaskSnapshot;
        issues?: Array<{ searchTerm: string; message: string }>;
        hasToken?: boolean;
    }) => {
        const cacheManager: Partial<TodoistCacheManager> = {
            ensureEntitiesUpToDate: vi.fn(),
            ensureTasks: vi.fn(),
            consumeTaskIssues: vi.fn().mockReturnValue(issues),
            getTaskSnapshot: vi.fn().mockReturnValue(snapshot),
            getProjectName: vi.fn().mockReturnValue(undefined),
            getLabelName: vi.fn().mockReturnValue(undefined),
            refreshTasks: vi.fn(),
            refreshAllCaches: vi.fn(),
            reportTaskIssue: vi.fn(),
        };

        if (!hasToken) {
            (cacheManager.getTaskSnapshot as ReturnType<typeof vi.fn>).mockReturnValue({
                tasks: [],
                isRefreshing: false,
                lastError: undefined,
                lastFilterError: false,
            });
        }

        return cacheManager as TodoistCacheManager;
    };

    const createProvider = ({
        cacheManager,
        settingsManager,
    }: {
        cacheManager: TodoistCacheManager;
        settingsManager: SettingsManager;
    }) => {
        const actionManagerStub: Pick<TodoistActionManager, "refreshTasksInBackground" | "requestSearchRefresh"> = {
            refreshTasksInBackground: vi.fn(),
            requestSearchRefresh: vi.fn(),
        };

        return new TodoistTaskListProvider(
            cacheManager,
            settingsManager,
            createTranslator(),
            { url: "file:///todoist.svg" },
            actionManagerStub as unknown as TodoistActionManager,
        );
    };

    it("returns empty result when prefix does not match", () => {
        const cacheManager = createCacheManager({
            snapshot: { tasks: [], isRefreshing: false, lastFilterError: false },
        });
        const provider = createProvider({ cacheManager, settingsManager: createSettingsManager() });
        const result = provider.createItems("note something");
        expect(result.before).toHaveLength(0);
        expect(result.after).toHaveLength(0);
    });

    it("returns missing token item when token absent", () => {
        const cacheManager = createCacheManager({
            snapshot: { tasks: [], isRefreshing: false, lastFilterError: false },
            hasToken: false,
        });
        const provider = createProvider({
            cacheManager,
            settingsManager: createSettingsManager({ apiToken: "" }),
        });
        const result = provider.createItems("tdl inbox");
        expect(result.after[0]?.name).toBe(resources["en-US"].missingTokenTaskList);
    });

    it("returns loading item when fetching", () => {
        const cacheManager = createCacheManager({
            snapshot: { tasks: [], isRefreshing: true, lastFilterError: false },
        });
        const provider = createProvider({ cacheManager, settingsManager: createSettingsManager() });
        const result = provider.createItems("tdl inbox");
        expect(result.before[0]?.name).toBe(resources["en-US"].loadingTasks);
        expect(result.after).toHaveLength(0);
    });

    it("returns task items when available", () => {
        const task = {
            id: "1",
            projectId: "p1",
            content: "Buy milk",
            url: "https://app.todoist.com/app/task/1",
            labels: [],
        } as unknown as Task;
        const cacheManager = createCacheManager({
            snapshot: { tasks: [task], isRefreshing: false, lastFilterError: false },
        });
        const provider = createProvider({ cacheManager, settingsManager: createSettingsManager() });
        const result = provider.createItems("tdl");
        expect(result.after[0]?.id).toBe("todoist-task-1");
    });

    it("returns error item when snapshot indicates error", () => {
        const cacheManager = createCacheManager({
            snapshot: {
                tasks: [],
                isRefreshing: false,
                lastError: "boom",
                lastFilterError: false,
            },
        });
        const provider = createProvider({ cacheManager, settingsManager: createSettingsManager() });
        const result = provider.createItems("tdl");
        expect(result.after[0]?.name).toBe("boom");
    });
});
