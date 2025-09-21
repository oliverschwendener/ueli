import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Logger } from "@Core/Logger";
import type { SettingsManager } from "@Core/SettingsManager";
import type { TaskScheduler } from "@Core/TaskScheduler";
import type { Translator } from "@Core/Translator";
import type { Task } from "@doist/todoist-api-typescript";
import { TodoistRequestError } from "@doist/todoist-api-typescript";
import type { Mock } from "vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TodoistApiClient, TodoistApiFactory } from "./TodoistApiFactory";
import { TodoistExtension } from "./TodoistExtension";
import { getTodoistI18nResources } from "./TodoistTranslations";

const resources = getTodoistI18nResources();

const createTranslator = (): Translator => ({
    createT: () => ({
        t: (key: string, options?: Record<string, string>) => {
            const dictionary = resources["en-US"] as Record<string, string>;
            const value = dictionary[key];

            if (!value) {
                return key;
            }

            if (options?.priority) {
                return value.replace("{{priority}}", options.priority);
            }

            return value;
        },
    }),
});

describe(TodoistExtension, () => {
    const setup = ({
        quickAddPrefix = "todo",
        taskListPrefix = "tdl",
        suggestionLimit = 15,
        apiToken = "",
        taskFilter = "",
    }: {
        quickAddPrefix?: string;
        taskListPrefix?: string;
        suggestionLimit?: number;
        apiToken?: string;
        taskFilter?: string;
    } = {}) => {
        const settings = new Map<string, unknown>([
            ["extension[Todoist].quickAddPrefix", quickAddPrefix],
            ["extension[Todoist].taskListPrefix", taskListPrefix],
            ["extension[Todoist].suggestionLimit", suggestionLimit],
            ["extension[Todoist].taskListLimit", 30],
            ["extension[Todoist].taskOpenTarget", "browser"],
            ["extension[Todoist].taskFilter", taskFilter],
            ["extension[Todoist].apiToken", apiToken],
        ]);

        const settingsManager: SettingsManager = {
            getValue: <T>(key: string, defaultValue: T) =>
                settings.has(key) ? (settings.get(key) as T) : defaultValue,
            updateValue: vi.fn(),
        };

        const assetPathResolver: AssetPathResolver = {
            getExtensionAssetPath: () => "/path/to/todoist.svg",
            getModuleAssetPath: () => "",
        };

        const taskScheduler: TaskScheduler = {
            scheduleTask: (task, waitMs) => setTimeout(task, waitMs),
            abortTask: (id) => clearTimeout(id),
        };

        const logger: Logger = {
            error: () => undefined,
            info: () => undefined,
            debug: () => undefined,
            warn: () => undefined,
        };

        const todoistApi: TodoistApiClient = {
            quickAddTask: vi.fn(),
            getLabels: vi.fn().mockResolvedValue({ results: [], nextCursor: null }),
            getProjects: vi.fn().mockResolvedValue({ results: [], nextCursor: null }),
            getTasks: vi.fn().mockResolvedValue({ results: [], nextCursor: null }),
            getTasksByFilter: vi.fn().mockResolvedValue({ results: [], nextCursor: null }),
        };

        const todoistApiFactory: TodoistApiFactory = {
            create: vi.fn().mockReturnValue(todoistApi),
        };

        const browserWindowNotifier = {
            notify: vi.fn(),
            notifyAll: vi.fn(),
        };

        const extension = new TodoistExtension(
            assetPathResolver,
            settingsManager,
            createTranslator(),
            taskScheduler,
            todoistApiFactory,
            logger,
            browserWindowNotifier,
        );

        return {
            extension,
            settings,
            todoistApi,
            todoistApiFactory,
        };
    };

    beforeEach(async () => {
        await Promise.resolve();
    });

    it("returns no results when prefix does not match", () => {
        const { extension } = setup();

        const result = extension.getInstantSearchResultItems("note buy milk");

        expect(result.before).toHaveLength(0);
        expect(result.after).toHaveLength(0);
    });

    it("returns quick add item", () => {
        const { extension } = setup();
        const result = extension.getInstantSearchResultItems("todo buy milk tomorrow");

        expect(result.before).toHaveLength(1);
        expect(result.before[0]?.defaultAction.argument).toBe(JSON.stringify({ text: "buy milk tomorrow" }));
    });

    it("suggests label candidates", () => {
        const { extension } = setup();

        // @ts-expect-error - set internal state directly for test purposes
        extension.labels = [
            { id: "1", name: "Home" },
            { id: "2", name: "Work" },
        ];

        const result = extension.getInstantSearchResultItems("todo plan @ho");

        expect(result.after).toHaveLength(1);
        expect(result.after[0]?.name).toBe("@Home");
        expect(result.after[0]?.defaultAction.argument).toBe(JSON.stringify({ newSearchTerm: "todo plan @Home " }));
    });

    it("hides project candidate when whitespace exact match", () => {
        const { extension } = setup();

        // @ts-expect-error - set internal state directly for test purposes
        extension.projects = [{ id: "1", name: "Home chores" }];

        const result = extension.getInstantSearchResultItems("todo clean #Home chores");

        expect(result.after).toHaveLength(0);
    });

    it("respects suggestion limit", () => {
        const { extension, settings } = setup({ suggestionLimit: 1 });

        // @ts-expect-error - set internal state directly for test purposes
        extension.labels = [
            { id: "1", name: "Alpha" },
            { id: "2", name: "Beta" },
        ];

        const result = extension.getInstantSearchResultItems("todo task @");

        expect(result.after).toHaveLength(1);
        expect(result.after[0]?.name).toBe("@Alpha");

        settings.set("extension[Todoist].suggestionLimit", 2);
        const updated = extension.getInstantSearchResultItems("todo task @");
        expect(updated.after).toHaveLength(2);
    });

    it("inserts priority candidates", () => {
        const { extension } = setup();

        const result = extension.getInstantSearchResultItems("todo schedule !p");

        expect(result.after).toHaveLength(4);
        expect(result.after[0]?.name).toBe("p1");
        expect(result.after[0]?.defaultAction.argument).toBe(JSON.stringify({ newSearchTerm: "todo schedule p1 " }));
    });

    it("shows priority candidates when bang only", () => {
        const { extension } = setup();

        const result = extension.getInstantSearchResultItems("todo schedule !");

        expect(result.after.map((item) => item?.name)).toEqual(["p1", "p2", "p3", "p4"]);
    });

    it("builds search term correctly with uppercase prefix", () => {
        const { extension } = setup({ quickAddPrefix: "todo" });

        // @ts-expect-error - set internal state directly for test purposes
        extension.labels = [{ id: "1", name: "Today" }];

        const result = extension.getInstantSearchResultItems("TODO   plan @to");

        expect(result.after[0]?.defaultAction.argument).toBe(JSON.stringify({ newSearchTerm: "TODO   plan @Today " }));
    });

    it("uses filter API when task filter is configured", async () => {
        const { extension, todoistApi } = setup({ apiToken: "token", taskFilter: "today" });

        const task = {
            id: "200",
            content: "Review meeting notes",
            url: "https://app.todoist.com/app/task/200",
            projectId: "project-1",
            labels: [],
            due: null,
            addedAt: "2024-01-01T00:00:00Z",
        } as unknown as Task;

        (todoistApi.getTasksByFilter as Mock).mockResolvedValueOnce({ results: [task], nextCursor: null });

        await extension.reloadTasks("tdl ");

        expect(todoistApi.getTasksByFilter).toHaveBeenCalledWith({
            query: "today",
            limit: expect.any(Number),
            cursor: undefined,
        });
        expect(todoistApi.getTasks).not.toHaveBeenCalled();

        const result = extension.getInstantSearchResultItems("tdl ");
        expect(result.after.find((item) => item?.id === "todoist-task-200")).toBeDefined();
    });

    it("displays filter syntax error when Todoist returns 400", async () => {
        const { extension, todoistApi } = setup({ apiToken: "token", taskFilter: "today" });

        (todoistApi.getTasksByFilter as Mock).mockRejectedValueOnce(new TodoistRequestError("Bad request", 400));

        await extension.reloadTasks("tdl ");

        const result = extension.getInstantSearchResultItems("tdl ");

        expect(result.after[0]?.name).toBe(resources["en-US"].taskFilterInvalid);
        expect(todoistApi.getTasks).not.toHaveBeenCalled();
    });

    it("returns task list items when task prefix matches", () => {
        const { extension } = setup({ apiToken: "token" });

        const task = {
            id: "100",
            content: "Review pull requests",
            url: "https://app.todoist.com/app/task/100",
            projectId: "project-1",
            labels: [],
            due: null,
            addedAt: "2024-01-01T00:00:00Z",
        } as unknown as Task;

        // @ts-expect-error - set internal state directly for test purposes
        extension.tasks = [task];
        // @ts-expect-error - set internal state directly for test purposes
        extension.tasksCacheExpiresAt = Date.now() + 60_000;

        const result = extension.getInstantSearchResultItems("tdl ");

        expect(result.before[0]?.id).toBe("todoist-task-reload");
        expect(result.after.find((item) => item?.id === "todoist-task-100")).toBeDefined();
        const taskItem = result.after.find((item) => item?.id === "todoist-task-100");
        expect(taskItem?.description).toBe(resources["en-US"].openTaskDescription);
    });
});
