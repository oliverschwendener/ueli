import type { BrowserWindowRegistry } from "@Core/BrowserWindowRegistry";
import type { Logger } from "@Core/Logger";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import type { BrowserWindow } from "electron";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { NotificationPresenter } from "./TodoistNotificationPresenter";
import { TodoistQuickAddActionHandler } from "./TodoistQuickAddActionHandler";
import type { TodoistApiClient, TodoistApiFactory } from "./TodoistApiFactory";
import { getTodoistI18nResources } from "./TodoistTranslations";

const resources = getTodoistI18nResources();

const createTranslator = (): Translator => ({
    createT: () => ({
        t: (key: string) => {
            const translation = (resources["en-US"] as Record<string, string>)[key];
            return translation ?? key;
        },
    }),
});

describe(TodoistQuickAddActionHandler, () => {
    const createBrowserWindow = () => {
        const browserWindow = {
            hide: vi.fn(),
            isDestroyed: () => false,
        } satisfies Pick<BrowserWindow, "hide" | "isDestroyed">;

        return browserWindow;
    };

    const createDependencies = ({
        apiToken = "token",
        quickAddTaskImplementation = vi.fn().mockResolvedValue(undefined),
    }: {
        apiToken?: string;
        quickAddTaskImplementation?: TodoistApiClient["quickAddTask"];
    }) => {
        const settingsManager: SettingsManager = {
            getValue: vi.fn().mockReturnValue(apiToken),
            updateValue: vi.fn(),
        };

        const notificationPresenter: NotificationPresenter = {
            show: vi.fn(),
        };

        const browserWindow = createBrowserWindow();
        const browserWindowRegistry: BrowserWindowRegistry = {
            getById: vi.fn().mockReturnValue(browserWindow as unknown as BrowserWindow),
            getAll: vi.fn(),
            register: vi.fn(),
            remove: vi.fn(),
        };

        const logger: Logger = {
            error: vi.fn(),
            info: vi.fn(),
            debug: vi.fn(),
            warn: vi.fn(),
        };

        const todoistApi: TodoistApiClient = {
            quickAddTask: vi.fn(quickAddTaskImplementation),
            getLabels: vi.fn(),
            getProjects: vi.fn(),
        };

        const todoistApiFactory: TodoistApiFactory = {
            create: vi.fn().mockReturnValue(todoistApi),
        };

        return {
            settingsManager,
            notificationPresenter,
            browserWindowRegistry,
            browserWindow,
            logger,
            todoistApiFactory,
            todoistApi,
        };
    };

    const createAction = (text: string) => ({
        argument: JSON.stringify({ text }),
        description: "",
        handlerId: "",
    });

    beforeEach(() => {
        vi.useFakeTimers();
    });

    it("成功時に通知を表示しウィンドウを閉じる", async () => {
        const dependencies = createDependencies({});

        const handler = new TodoistQuickAddActionHandler(
            dependencies.todoistApiFactory,
            dependencies.settingsManager,
            createTranslator(),
            dependencies.notificationPresenter,
            dependencies.browserWindowRegistry,
            dependencies.logger,
        );

        await handler.invokeAction(createAction("task"));

        expect(dependencies.todoistApiFactory.create).toHaveBeenCalledWith("token");
        expect(dependencies.todoistApi.quickAddTask).toHaveBeenCalledWith({ text: "task" });

        expect(dependencies.notificationPresenter.show).toHaveBeenCalledWith({
            title: "Todoist",
            body: "Task added.",
        });

        expect(dependencies.browserWindow.hide).toHaveBeenCalledOnce();
        expect(dependencies.logger.error).not.toHaveBeenCalled();
    });

    it("APIエラー時にエラーログと通知を行う", async () => {
        const dependencies = createDependencies({
            quickAddTaskImplementation: vi.fn().mockRejectedValue(new Error("API failed")),
        });

        const handler = new TodoistQuickAddActionHandler(
            dependencies.todoistApiFactory,
            dependencies.settingsManager,
            createTranslator(),
            dependencies.notificationPresenter,
            dependencies.browserWindowRegistry,
            dependencies.logger,
        );

        await handler.invokeAction(createAction("task"));

        expect(dependencies.logger.error).toHaveBeenCalledOnce();

        expect(dependencies.notificationPresenter.show).toHaveBeenCalledWith({
            title: "Todoist",
            body: "Failed to add task.",
        });

        expect(dependencies.browserWindow.hide).toHaveBeenCalledOnce();
    });

    it("トークン未設定時にAPIを呼び出さず通知を行う", async () => {
        const dependencies = createDependencies({ apiToken: "" });

        const handler = new TodoistQuickAddActionHandler(
            dependencies.todoistApiFactory,
            dependencies.settingsManager,
            createTranslator(),
            dependencies.notificationPresenter,
            dependencies.browserWindowRegistry,
            dependencies.logger,
        );

        await handler.invokeAction(createAction("task"));

        expect(dependencies.todoistApiFactory.create).not.toHaveBeenCalled();
        expect(dependencies.notificationPresenter.show).toHaveBeenCalledWith({
            title: "Todoist",
            body: "Please configure your API token.",
        });
        expect(dependencies.browserWindow.hide).toHaveBeenCalledOnce();
    });

    afterEach(() => {
        vi.useRealTimers();
    });
});
