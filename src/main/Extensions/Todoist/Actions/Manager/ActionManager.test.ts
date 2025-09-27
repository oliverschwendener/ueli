import type { BrowserWindowRegistry } from "@Core/BrowserWindowRegistry";
import type { Logger } from "@Core/Logger";
import type { NotificationService } from "@Core/Notification";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import type { BrowserWindow, Shell } from "electron";
import { describe, expect, it, vi } from "vitest";
import type { TodoistCacheManager } from "../../Caching";
import type { TodoistApiClient, TodoistApiFactory } from "../../Shared";
import { getTodoistI18nResources } from "../../Shared";
import { TodoistActionManager } from "./ActionManager";

const resources = getTodoistI18nResources();

const createTranslator = (): Translator => ({
    createT: () => ({
        t: (key: string) => {
            const dictionary = resources["en-US"] as Record<string, string>;
            return dictionary[key] ?? key;
        },
    }),
});

describe(TodoistActionManager, () => {
    const createBrowserWindow = () => {
        const browserWindow = {
            hide: vi.fn(),
            isDestroyed: () => false,
        } satisfies Pick<BrowserWindow, "hide" | "isDestroyed">;

        return browserWindow;
    };

    const createLogger = (): Logger => ({
        debug: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
    });

    const createDependencies = ({
        apiToken = "token",
        taskOpenTarget = "browser" as "browser" | "desktopApp",
        quickAddImplementation = vi.fn().mockResolvedValue(undefined),
        openExternalImplementations = [vi.fn().mockResolvedValue(undefined)],
    } = {}) => {
        const settings = new Map<string, unknown>([
            ["extension[Todoist].apiToken", apiToken],
            ["extension[Todoist].taskOpenTarget", taskOpenTarget],
        ]);

        const settingsManager: SettingsManager = {
            getValue: <T>(key: string, defaultValue: T, _sensitive?: boolean) => {
                void _sensitive;
                return settings.has(key) ? (settings.get(key) as T) : defaultValue;
            },
            updateValue: vi.fn(),
        };

        const notificationService: NotificationService = {
            show: vi.fn(),
        };

        const browserWindow = createBrowserWindow();
        const browserWindowRegistry: BrowserWindowRegistry = {
            getById: vi.fn().mockReturnValue(browserWindow as unknown as BrowserWindow),
            getAll: vi.fn(),
            register: vi.fn(),
            remove: vi.fn(),
        };

        const logger = createLogger();

        const todoistApi: TodoistApiClient = {
            quickAddTask: vi.fn(quickAddImplementation),
            getLabels: vi.fn(),
            getProjects: vi.fn(),
            getTasks: vi.fn(),
            getTasksByFilter: vi.fn(),
        };

        const todoistApiFactory: TodoistApiFactory = {
            create: vi.fn().mockReturnValue(todoistApi),
        };

        const openExternal = vi.fn();
        openExternalImplementations.forEach((impl) => {
            openExternal.mockImplementationOnce((url: string) => impl(url));
        });

        const shell = <Pick<Shell, "openExternal">>{
            openExternal: (url: string) => openExternal(url),
        };

        const cacheManager: Pick<TodoistCacheManager, "reportTaskIssue" | "refreshTasks" | "refreshAllCaches"> = {
            reportTaskIssue: vi.fn(),
            refreshTasks: vi.fn(),
            refreshAllCaches: vi.fn(),
        };

        const manager = new TodoistActionManager(
            todoistApiFactory,
            settingsManager,
            createTranslator(),
            notificationService,
            browserWindowRegistry,
            logger,
            shell as Shell,
            cacheManager as TodoistCacheManager,
        );

        return {
            manager,
            notificationService,
            browserWindow,
            todoistApiFactory,
            todoistApi,
            cacheManager,
            logger,
            openExternal,
        };
    };

    it("quick add success shows notification and hides window", async () => {
        const deps = createDependencies();
        await deps.manager.quickAdd("buy milk");

        expect(deps.todoistApiFactory.create).toHaveBeenCalledWith("token");
        expect(deps.todoistApi.quickAddTask).toHaveBeenCalledWith({ text: "buy milk" });
        expect(deps.notificationService.show).toHaveBeenCalledWith({
            title: "Todoist",
            body: "Task added.",
        });
        expect(deps.browserWindow.hide).toHaveBeenCalled();
    });

    it("quick add handles missing token", async () => {
        const deps = createDependencies({ apiToken: "" });
        await deps.manager.quickAdd("task");

        expect(deps.notificationService.show).toHaveBeenCalledWith({
            title: "Todoist",
            body: "Please configure your API token.",
        });
        expect(deps.todoistApiFactory.create).not.toHaveBeenCalled();
        expect(deps.browserWindow.hide).toHaveBeenCalled();
    });

    it("quick add logs error on API failure", async () => {
        const deps = createDependencies({
            quickAddImplementation: vi.fn().mockRejectedValue(new Error("fail")),
        });
        await deps.manager.quickAdd("task");

        expect(deps.logger.error).toHaveBeenCalled();
        expect(deps.notificationService.show).toHaveBeenLastCalledWith({
            title: "Todoist",
            body: "Failed to add task.",
        });
    });

    it("opens browser when configured", async () => {
        const deps = createDependencies({ taskOpenTarget: "browser" });
        await deps.manager.openTask({
            taskId: "1",
            webUrl: "https://app.todoist.com/app/task/1",
            desktopUrl: "todoist://task?id=1",
            searchTerm: "tdl",
        });

        expect(deps.openExternal).toHaveBeenCalledWith("https://app.todoist.com/app/task/1");
        expect(deps.browserWindow.hide).toHaveBeenCalled();
    });

    it("opens desktop app when configured", async () => {
        const deps = createDependencies({ taskOpenTarget: "desktopApp" });
        await deps.manager.openTask({
            taskId: "1",
            webUrl: "https://app.todoist.com/app/task/1",
            desktopUrl: "todoist://task?id=1",
            searchTerm: "tdl",
        });

        expect(deps.openExternal).toHaveBeenCalledWith("todoist://task?id=1");
        expect(deps.browserWindow.hide).toHaveBeenCalled();
    });

    it("falls back to browser and reports issue", async () => {
        const deps = createDependencies({
            taskOpenTarget: "desktopApp",
            openExternalImplementations: [
                vi.fn().mockRejectedValue(new Error("desktop")),
                vi.fn().mockResolvedValue(undefined),
            ],
        });

        await deps.manager.openTask({
            taskId: "1",
            webUrl: "https://app.todoist.com/app/task/1",
            desktopUrl: "todoist://task?id=1",
            searchTerm: "tdl",
        });

        expect(deps.openExternal).toHaveBeenNthCalledWith(1, "todoist://task?id=1");
        expect(deps.openExternal).toHaveBeenNthCalledWith(2, "https://app.todoist.com/app/task/1");
        expect(deps.cacheManager.reportTaskIssue).toHaveBeenCalledWith({
            searchTerm: "tdl",
            message: resources["en-US"].desktopOpenFailedFallback,
        });
    });

    it("reports error when fallback fails", async () => {
        const deps = createDependencies({
            taskOpenTarget: "desktopApp",
            openExternalImplementations: [
                vi.fn().mockRejectedValue(new Error("desktop")),
                vi.fn().mockRejectedValue(new Error("browser")),
            ],
        });

        await deps.manager.openTask({
            taskId: "1",
            webUrl: "https://app.todoist.com/app/task/1",
            desktopUrl: "todoist://task?id=1",
            searchTerm: "tdl",
        });

        expect(deps.cacheManager.reportTaskIssue).toHaveBeenCalledWith({
            searchTerm: "tdl",
            message: resources["en-US"].desktopOpenFailed,
        });
        expect(deps.logger.error).toHaveBeenCalled();
    });
});
