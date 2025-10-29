import { getExtensionSettingKey } from "@common/Core/Extension";
import type { TaskOpenTarget } from "@common/Extensions/Todoist";
import type { BrowserWindowNotifier } from "@Core/BrowserWindowNotifier";
import type { BrowserWindowRegistry } from "@Core/BrowserWindowRegistry";
import type { Logger } from "@Core/Logger";
import type { Notification } from "@Core/Notification";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import type { Shell } from "electron";
import type { TodoistCacheManager } from "../../Caching";
import type { TodoistApiFactory } from "../../Shared";
import { getTodoistI18nResources, todoistDefaultSettings } from "../../Shared";

const TodoistExtensionId = "Todoist";
const OpenExternalTimeoutInMs = 3000;

export class TodoistActionManager {
    public constructor(
        private readonly todoistApiFactory: TodoistApiFactory,
        private readonly settingsManager: SettingsManager,
        private readonly translator: Translator,
        private readonly notification: Notification,
        private readonly browserWindowRegistry: BrowserWindowRegistry,
        private readonly logger: Logger,
        private readonly shell: Shell,
        private readonly cacheManager: TodoistCacheManager,
        private readonly browserWindowNotifier: BrowserWindowNotifier,
    ) {}

    public async quickAdd(text: string): Promise<void> {
        const normalizedText = text.trim();

        if (normalizedText.length === 0) {
            this.logger.warn("Todoist quick add called with empty text.");
            return;
        }

        const { t } = this.translator.createT(getTodoistI18nResources());
        const apiToken = this.getApiToken();

        if (!apiToken) {
            this.notification.show({
                title: t("notificationTitle"),
                body: t("missingTokenNotificationBody"),
            });
            this.hideSearchWindow();
            return;
        }

        try {
            const todoistApi = this.todoistApiFactory.create(apiToken);
            await todoistApi.quickAddTask({ text: normalizedText });

            this.notification.show({
                title: t("notificationTitle"),
                body: t("quickAddSuccessNotificationBody"),
            });

            // Immediately refresh tasks in the background so that the next
            // task-list search reflects the newly added item.
            void this.cacheManager.refreshTasks();
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Todoist quick add failed. Reason: ${message}`);

            this.notification.show({
                title: t("notificationTitle"),
                body: t("quickAddFailureNotificationBody"),
            });
        } finally {
            this.hideSearchWindow();
        }
    }

    public async openTask(params: {
        taskId: string;
        webUrl: string;
        desktopUrl: string;
        searchTerm: string;
    }): Promise<void> {
        const { taskId, webUrl, desktopUrl, searchTerm } = params;
        const { t } = this.translator.createT(getTodoistI18nResources());
        const target = this.getTaskOpenTarget();

        try {
            switch (target) {
                case "browser": {
                    await this.openExternalWithTimeout(webUrl);
                    this.hideSearchWindow();
                    return;
                }
                case "desktopApp": {
                    try {
                        await this.openExternalWithTimeout(desktopUrl);
                        this.hideSearchWindow();
                        return;
                    } catch (desktopError) {
                        const desktopMessage =
                            desktopError instanceof Error ? desktopError.message : String(desktopError);
                        this.logger.warn(
                            `Opening Todoist desktop task failed for ${taskId}. Reason: ${desktopMessage}`,
                        );

                        try {
                            await this.openExternalWithTimeout(webUrl);
                            this.cacheManager.reportTaskIssue({
                                searchTerm,
                                message: t("desktopOpenFailedFallback"),
                            });
                            this.requestSearchRefresh(searchTerm);
                            return;
                        } catch (browserError) {
                            const browserMessage =
                                browserError instanceof Error ? browserError.message : String(browserError);
                            this.logger.error(
                                `Fallback to browser for Todoist task ${taskId} failed. Reason: ${browserMessage}`,
                            );
                            this.cacheManager.reportTaskIssue({
                                searchTerm,
                                message: t("desktopOpenFailed"),
                            });
                            this.requestSearchRefresh(searchTerm);
                        }
                    }

                    return;
                }
                default: {
                    const exhaustiveCheck: never = target;
                    throw new Error(`Unsupported Todoist task open target: ${exhaustiveCheck}`);
                }
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Todoist open task handler failed. Reason: ${message}`);
        }
    }

    public async refreshCaches(searchTerm: string): Promise<void> {
        await this.cacheManager.refreshTasks();
        this.requestSearchRefresh(searchTerm);
    }

    public async refreshAll(): Promise<void> {
        await this.cacheManager.refreshAllCaches();
    }

    public getTaskOpenTarget(): TaskOpenTarget {
        // Normalize runtime value from persisted settings; unknown strings fall back
        // to a safe default to remain robust across manual edits or older versions.
        const value = this.settingsManager.getValue<TaskOpenTarget>(
            getExtensionSettingKey(TodoistExtensionId, "taskOpenTarget"),
            todoistDefaultSettings.taskOpenTarget,
        );

        return value === "desktopApp" ? "desktopApp" : "browser";
    }

    private getApiToken(): string {
        return this.settingsManager.getValue<string>(
            getExtensionSettingKey(TodoistExtensionId, "apiToken"),
            todoistDefaultSettings.apiToken,
            true,
        );
    }

    private async openExternalWithTimeout(url: string): Promise<void> {
        let timeoutId: NodeJS.Timeout | undefined;
        const timeoutPromise = new Promise<never>((_, reject) => {
            timeoutId = setTimeout(() => {
                reject(new Error("openExternal timed out"));
            }, OpenExternalTimeoutInMs);
        });

        try {
            await Promise.race([this.shell.openExternal(url), timeoutPromise]);
        } finally {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        }
    }

    private hideSearchWindow(): void {
        const searchWindow = this.browserWindowRegistry.getById("search");

        if (searchWindow && !searchWindow.isDestroyed()) {
            searchWindow.hide();
        }
    }

    /**
     * Request renderer to re-run the current search without altering the input field.
     * This avoids focus/selection side-effects caused by setSearchTerm.
     */
    public requestSearchRefresh(searchTerm?: string): void {
        this.browserWindowNotifier.notify({
            browserWindowId: "search",
            channel: "refreshInstantSearch",
            data: searchTerm,
        });
    }

    /**
     * Fire-and-forget helper for TaskList provider to refresh tasks
     * and then ask renderer to re-run search for the same term.
     */
    public refreshTasksInBackground(searchTerm: string): void {
        void this.cacheManager
            .ensureTasks()
            .catch(() => undefined)
            .finally(() => this.requestSearchRefresh(searchTerm));
    }
}
