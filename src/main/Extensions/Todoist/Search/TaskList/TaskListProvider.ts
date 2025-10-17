import type { InstantSearchResultItems, SearchResultItem } from "@common/Core";
import { createEmptyInstantSearchResult } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import type { TaskOpenTarget } from "@common/Extensions/Todoist";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import type { Task } from "@doist/todoist-api-typescript";
import type { TodoistActionManager } from "../../Actions";
import { RefreshCachesHandlerId, TodoistOpenTaskHandlerId } from "../../Actions";
import type { TodoistCacheManager } from "../../Caching";
import type { TodoistTaskIssue } from "../../Shared";
import { getTodoistI18nResources, todoistDefaultSettings, todoistTranslationNamespace } from "../../Shared";

const TodoistExtensionId = "Todoist";

export class TodoistTaskListProvider {
    public constructor(
        private readonly cacheManager: TodoistCacheManager,
        private readonly settingsManager: SettingsManager,
        private readonly translator: Translator,
        private readonly image: Image,
        private readonly actionManager: TodoistActionManager,
    ) {}

    public createItems(searchTerm: string): InstantSearchResultItems {
        const taskListMatch = this.createTaskListPrefixRegExp().exec(searchTerm);

        if (!taskListMatch) {
            return createEmptyInstantSearchResult();
        }

        this.cacheManager.ensureEntitiesUpToDate();

        const { t } = this.translator.createT(getTodoistI18nResources());
        const prefixPart = taskListMatch[0];
        const filterText = searchTerm.slice(prefixPart.length).trim();

        if (!this.hasApiToken()) {
            return {
                before: [],
                after: [this.createMissingTokenItem(t, searchTerm)],
            };
        }

        // Fetch tasks asynchronously and request a non-intrusive re-search when done
        this.actionManager.refreshTasksInBackground(searchTerm);

        const beforeItems: SearchResultItem[] = [];
        const issues = this.cacheManager.consumeTaskIssues(searchTerm);
        this.appendIssues(beforeItems, issues, searchTerm, t);

        const snapshot = this.cacheManager.getTaskSnapshot();
        const isLoading = snapshot.isRefreshing;
        const hasError = snapshot.lastFilterError || typeof snapshot.lastError === "string";

        if (isLoading) {
            beforeItems.push(this.createTaskLoadingItem(t, searchTerm));
        }

        if (isLoading && snapshot.tasks.length === 0 && !hasError) {
            return {
                before: beforeItems,
                after: [],
            };
        }

        if (hasError && snapshot.tasks.length === 0) {
            const message = snapshot.lastFilterError
                ? t("taskFilterInvalid")
                : (snapshot.lastError ?? t("taskListError"));
            return {
                before: beforeItems,
                after: [this.createTaskErrorItem(message, searchTerm, t)],
            };
        }

        const filteredTasks = this.filterTasks(snapshot.tasks, filterText).slice(0, this.getTaskListLimit());

        if (!isLoading && filteredTasks.length === 0) {
            return {
                before: beforeItems,
                after: [this.createTaskEmptyItem(t, searchTerm)],
            };
        }

        const defaultTarget = this.getTaskOpenTarget();
        const afterItems = filteredTasks.map((task) =>
            this.createTaskSearchResultItem({
                task,
                searchTerm,
                defaultTarget,
                t,
            }),
        );

        // Keep loading indicator in the "before" section for consistency

        return {
            before: beforeItems,
            after: afterItems,
        };
    }

    private appendIssues(
        beforeItems: SearchResultItem[],
        issues: TodoistTaskIssue[],
        searchTerm: string,
        t: ReturnType<Translator["createT"]>["t"],
    ): void {
        if (issues.length === 0) {
            return;
        }

        for (const issue of issues) {
            beforeItems.unshift(this.createTaskErrorItem(issue.message, searchTerm, t));
        }
    }

    private filterTasks(tasks: Task[], filter: string): Task[] {
        if (!filter) {
            return tasks;
        }

        const filterLower = filter.toLowerCase();

        return tasks.filter((task) => {
            if (task.content.toLowerCase().includes(filterLower)) {
                return true;
            }

            const projectName = this.cacheManager.getProjectName(task.projectId);

            if (projectName && projectName.toLowerCase().includes(filterLower)) {
                return true;
            }

            for (const labelId of task.labels) {
                const labelName = this.cacheManager.getLabelName(labelId);

                if (labelName && labelName.toLowerCase().includes(filterLower)) {
                    return true;
                }
            }

            return false;
        });
    }

    // Note: Explicit "Reload tasks" item has been removed per UX change.

    private createTaskLoadingItem(t: ReturnType<Translator["createT"]>["t"], searchTerm: string): SearchResultItem {
        return {
            id: "todoist-task-loading",
            name: t("loadingTasks"),
            description: "",
            image: this.image,
            defaultAction: {
                handlerId: RefreshCachesHandlerId,
                argument: JSON.stringify({ searchTerm }),
                description: t("refreshCachesDescription"),
                descriptionTranslation: {
                    key: "refreshCachesDescription",
                    namespace: todoistTranslationNamespace,
                },
            },
        };
    }

    private createTaskErrorItem(
        message: string,
        searchTerm: string,
        t: ReturnType<Translator["createT"]>["t"],
    ): SearchResultItem {
        return {
            id: `todoist-task-error-${Date.now()}`,
            name: message,
            description: t("refreshCachesDescription"),
            image: this.image,
            defaultAction: {
                handlerId: RefreshCachesHandlerId,
                argument: JSON.stringify({ searchTerm }),
                description: t("refreshCachesDescription"),
                descriptionTranslation: {
                    key: "refreshCachesDescription",
                    namespace: todoistTranslationNamespace,
                },
            },
        };
    }

    private createMissingTokenItem(t: ReturnType<Translator["createT"]>["t"], searchTerm: string): SearchResultItem {
        return {
            id: "todoist-task-missing-token",
            name: t("missingTokenTaskList"),
            description: t("refreshCachesDescription"),
            image: this.image,
            defaultAction: {
                handlerId: RefreshCachesHandlerId,
                argument: JSON.stringify({ searchTerm }),
                description: t("refreshCachesDescription"),
                descriptionTranslation: {
                    key: "refreshCachesDescription",
                    namespace: todoistTranslationNamespace,
                },
            },
        };
    }

    private createTaskEmptyItem(t: ReturnType<Translator["createT"]>["t"], searchTerm: string): SearchResultItem {
        return {
            id: "todoist-task-empty",
            name: t("taskListEmpty"),
            description: "",
            image: this.image,
            defaultAction: {
                handlerId: RefreshCachesHandlerId,
                argument: JSON.stringify({ searchTerm }),
                description: t("refreshCachesDescription"),
                descriptionTranslation: {
                    key: "refreshCachesDescription",
                    namespace: todoistTranslationNamespace,
                },
            },
        };
    }

    private createTaskSearchResultItem({
        task,
        searchTerm,
        defaultTarget,
        t,
    }: {
        task: Task;
        searchTerm: string;
        defaultTarget: TaskOpenTarget;
        t: ReturnType<Translator["createT"]>["t"];
    }): SearchResultItem {
        const desktopUrl = `todoist://task?id=${task.id}`;
        const defaultActionKey = (() => {
            switch (defaultTarget) {
                case "desktopApp":
                    return "openInDesktopApp" as const;
                case "browser":
                    return "openInBrowser" as const;
                default: {
                    defaultTarget satisfies never;
                    throw new Error(`Unsupported Todoist task open target: ${defaultTarget}`);
                }
            }
        })();

        return {
            id: `todoist-task-${task.id}`,
            name: task.content,
            description: t("openTaskDescription"),
            descriptionTranslation: {
                key: "openTaskDescription",
                namespace: todoistTranslationNamespace,
            },
            image: this.image,
            defaultAction: {
                handlerId: TodoistOpenTaskHandlerId,
                argument: JSON.stringify({
                    taskId: task.id,
                    webUrl: task.url,
                    desktopUrl,
                    searchTerm,
                }),
                description: t(defaultActionKey),
                descriptionTranslation: {
                    key: defaultActionKey,
                    namespace: todoistTranslationNamespace,
                },
            },
        };
    }

    private createTaskListPrefixRegExp(): RegExp {
        const prefix = this.getTaskListPrefix();
        return new RegExp(`^${TodoistTaskListProvider.escapeRegExp(prefix)}\\s*`, "i");
    }

    private getTaskListPrefix(): string {
        // See note in CacheManager.getTaskFilter: we validate runtime types for
        // settings because persisted values may be malformed or from older versions.
        const value = this.settingsManager.getValue<string>(
            getExtensionSettingKey(TodoistExtensionId, "taskListPrefix"),
            todoistDefaultSettings.taskListPrefix,
        );

        return typeof value === "string" && value.trim().length > 0
            ? value.trim()
            : todoistDefaultSettings.taskListPrefix;
    }

    private getTaskListLimit(): number {
        // Render-only cap: validate number shape to avoid NaN/negative values
        // from user-edited settings files.
        const value = this.settingsManager.getValue<number>(
            getExtensionSettingKey(TodoistExtensionId, "taskListLimit"),
            todoistDefaultSettings.taskListLimit,
        );

        if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
            return todoistDefaultSettings.taskListLimit;
        }

        return Math.floor(value);
    }

    private getTaskOpenTarget(): TaskOpenTarget {
        // Normalize to a safe enum value; unknown strings fall back to "browser".
        const value = this.settingsManager.getValue<TaskOpenTarget>(
            getExtensionSettingKey(TodoistExtensionId, "taskOpenTarget"),
            todoistDefaultSettings.taskOpenTarget,
        );

        return value === "desktopApp" ? "desktopApp" : "browser";
    }

    private hasApiToken(): boolean {
        const token = this.settingsManager.getValue<string>(
            getExtensionSettingKey(TodoistExtensionId, "apiToken"),
            todoistDefaultSettings.apiToken,
            true,
        );

        return typeof token === "string" && token.trim().length > 0;
    }

    private static escapeRegExp(value: string): string {
        return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
}
