import type { BrowserWindowRegistry } from "@Core/BrowserWindowRegistry";
import type { Logger } from "@Core/Logger";
import type { NotificationService } from "@Core/Notification";
import type { SettingsManager } from "@Core/SettingsManager";
import type { TaskScheduler } from "@Core/TaskScheduler";
import type { Translator } from "@Core/Translator";
import type { Shell } from "electron";
import { describe, expect, it, vi } from "vitest";
import { TodoistCacheManager } from "../../Caching";
import type { TodoistApiFactory } from "../../Shared";
import { TodoistActionManager } from "./ActionManager";

describe(TodoistActionManager, () => {
    const createSettingsManager = (overrides?: Partial<Record<string, unknown>>): SettingsManager => {
        const map = new Map<string, unknown>();
        map.set("extension[Todoist].apiToken", overrides?.apiToken ?? "token");
        map.set("extension[Todoist].taskOpenTarget", overrides?.taskOpenTarget ?? "browser");
        return {
            getValue: <T>(key: string, defaultValue: T) => (map.has(key) ? (map.get(key) as T) : defaultValue),
            updateValue: vi.fn(),
        };
    };

    const createTranslator = (): Translator => ({
        createT: () => ({ t: (k: string) => k }),
    });

    const createLogger = (): Logger => ({ debug: vi.fn(), error: vi.fn(), info: vi.fn(), warn: vi.fn() });

    const createTaskScheduler = (): TaskScheduler => ({ scheduleTask: vi.fn(), abortTask: vi.fn() });

    it("quickAdd triggers immediate background task refresh", async () => {
        const quickAddTask = vi.fn().mockResolvedValue(undefined);
        const todoistApiFactory: TodoistApiFactory = {
            create: vi.fn().mockReturnValue({
                getLabels: vi.fn(),
                getProjects: vi.fn(),
                getTasks: vi.fn(),
                getTasksByFilter: vi.fn(),
                quickAddTask,
            }),
        };

        const settings = createSettingsManager();
        const cacheManager = new TodoistCacheManager(
            settings,
            createTaskScheduler(),
            todoistApiFactory,
            createLogger(),
            { notify: vi.fn(), notifyAll: vi.fn() }
        );

        const notificationService: NotificationService = { show: vi.fn() };
        const browserWindowRegistry: BrowserWindowRegistry = {
            getById: vi.fn().mockReturnValue({ isDestroyed: () => false, hide: vi.fn() } as any),
            register: vi.fn(),
            unregister: vi.fn(),
        };

        const shell = { openExternal: vi.fn().mockResolvedValue(undefined) } as unknown as Shell;

        const actionManager = new TodoistActionManager(
            todoistApiFactory,
            settings,
            createTranslator(),
            notificationService,
            browserWindowRegistry,
            createLogger(),
            shell,
            cacheManager,
        );

        const ensureTasksSpy = vi.spyOn(cacheManager, "ensureTasks").mockResolvedValue(undefined);

        await actionManager.quickAdd("New task from test");

        expect(quickAddTask).toHaveBeenCalled();
        expect(notificationService.show).toHaveBeenCalled();
        expect(ensureTasksSpy).toHaveBeenCalledWith({ force: true });
    });
});

