import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Logger } from "@Core/Logger";
import type { SettingsManager } from "@Core/SettingsManager";
import type { TaskScheduler } from "@Core/TaskScheduler";
import type { Translator } from "@Core/Translator";
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
        prefix = "todo",
        suggestionLimit = 15,
        apiToken = "",
    }: {
        prefix?: string;
        suggestionLimit?: number;
        apiToken?: string;
    } = {}) => {
        const settings = new Map<string, unknown>([
            ["extension[Todoist].prefix", prefix],
            ["extension[Todoist].suggestionLimit", suggestionLimit],
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
        };

        const todoistApiFactory: TodoistApiFactory = {
            create: vi.fn().mockReturnValue(todoistApi),
        };

        const extension = new TodoistExtension(
            assetPathResolver,
            settingsManager,
            createTranslator(),
            taskScheduler,
            todoistApiFactory,
            logger,
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
        const { extension } = setup({ prefix: "todo" });

        // @ts-expect-error - set internal state directly for test purposes
        extension.labels = [{ id: "1", name: "Today" }];

        const result = extension.getInstantSearchResultItems("TODO   plan @to");

        expect(result.after[0]?.defaultAction.argument).toBe(JSON.stringify({ newSearchTerm: "TODO   plan @Today " }));
    });
});
