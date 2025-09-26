import type { TaskOpenTarget } from "@common/Extensions/Todoist";
import type { BrowserWindowRegistry } from "@Core/BrowserWindowRegistry";
import type { Logger } from "@Core/Logger";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import type { BrowserWindow, Shell } from "electron";
import { describe, expect, it, vi } from "vitest";
import { TodoistOpenTaskActionHandler } from "./TodoistOpenTaskActionHandler";
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

const createBrowserWindow = () => {
    const browserWindow = {
        hide: vi.fn(),
        isDestroyed: () => false,
    } satisfies Pick<BrowserWindow, "hide" | "isDestroyed">;

    return browserWindow;
};

describe(TodoistOpenTaskActionHandler, () => {
    const createDependencies = ({
        taskOpenTarget = "browser" as TaskOpenTarget,
        openExternalImplementations = [vi.fn().mockResolvedValue(undefined)],
    }: {
        taskOpenTarget?: TaskOpenTarget;
        openExternalImplementations?: Array<(url: string, index: number) => unknown>;
    } = {}) => {
        const settings = new Map<string, unknown>([["extension[Todoist].taskOpenTarget", taskOpenTarget]]);

        const settingsManager: SettingsManager = {
            getValue: <T>(key: string, defaultValue: T) =>
                settings.has(key) ? (settings.get(key) as T) : defaultValue,
            updateValue: vi.fn(),
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

        const openExternal = vi.fn();
        openExternalImplementations.forEach((impl, index) => {
            openExternal.mockImplementationOnce((url: string) => impl(url, index));
        });

        const shell = <Pick<Shell, "openExternal">>{
            openExternal: (url: string) => openExternal(url),
        };

        const reportTaskOpenIssue = vi.fn();

        return {
            handler: new TodoistOpenTaskActionHandler(
                shell as Shell,
                settingsManager,
                createTranslator(),
                browserWindowRegistry,
                logger,
                reportTaskOpenIssue,
            ),
            browserWindow,
            browserWindowRegistry,
            openExternal,
            reportTaskOpenIssue,
            logger,
        };
    };

    const createAction = () => ({
        argument: JSON.stringify({
            taskId: "task-1",
            webUrl: "https://app.todoist.com/app/task/1",
            desktopUrl: "todoist://task?id=1",
            searchTerm: "tdl",
        }),
        description: "",
        handlerId: "",
    });

    it("opens browser when configured", async () => {
        const dependencies = createDependencies({ taskOpenTarget: "browser" });

        await dependencies.handler.invokeAction(createAction());

        expect(dependencies.openExternal).toHaveBeenCalledWith("https://app.todoist.com/app/task/1");
        expect(dependencies.browserWindow.hide).toHaveBeenCalled();
        expect(dependencies.reportTaskOpenIssue).not.toHaveBeenCalled();
    });

    it("opens desktop when configured", async () => {
        const dependencies = createDependencies({ taskOpenTarget: "desktopApp" });

        await dependencies.handler.invokeAction(createAction());

        expect(dependencies.openExternal).toHaveBeenCalledWith("todoist://task?id=1");
        expect(dependencies.browserWindow.hide).toHaveBeenCalled();
    });

    it("falls back to browser and reports issue when desktop fails", async () => {
        const dependencies = createDependencies({
            taskOpenTarget: "desktopApp",
            openExternalImplementations: [
                vi.fn().mockRejectedValue(new Error("desktop error")),
                vi.fn().mockResolvedValue(undefined),
            ],
        });

        await dependencies.handler.invokeAction(createAction());

        expect(dependencies.openExternal).toHaveBeenNthCalledWith(1, "todoist://task?id=1");
        expect(dependencies.openExternal).toHaveBeenNthCalledWith(2, "https://app.todoist.com/app/task/1");
        expect(dependencies.browserWindow.hide).not.toHaveBeenCalled();
        expect(dependencies.reportTaskOpenIssue).toHaveBeenCalledWith({
            searchTerm: "tdl",
            message: resources["en-US"].desktopOpenFailedFallback,
        });
    });

    it("reports failure when fallback also fails", async () => {
        const dependencies = createDependencies({
            taskOpenTarget: "desktopApp",
            openExternalImplementations: [
                vi.fn().mockRejectedValue(new Error("desktop error")),
                vi.fn().mockRejectedValue(new Error("browser error")),
            ],
        });

        await dependencies.handler.invokeAction(createAction());

        expect(dependencies.reportTaskOpenIssue).toHaveBeenCalledWith({
            searchTerm: "tdl",
            message: resources["en-US"].desktopOpenFailed,
        });
        expect(dependencies.browserWindow.hide).not.toHaveBeenCalled();
        expect(dependencies.logger.error).toHaveBeenCalled();
    });
});
