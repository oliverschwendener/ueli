import type { Logger } from "@Core/Logger";
import type { SettingsManager } from "@Core/SettingsManager";
import type { TaskScheduler } from "@Core/TaskScheduler";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Task } from "@doist/todoist-api-typescript";
import { TodoistRequestError } from "@doist/todoist-api-typescript";
import type { TodoistApiFactory, TodoistEntity, TodoistTaskIssue, TodoistTaskSnapshot } from "../Shared";
import { todoistDefaultSettings } from "../Shared";
import { TodoistEntityFetcher } from "./EntityFetcher";

const TodoistExtensionId = "Todoist";
const CacheRefreshIntervalInMs = 5 * 60 * 1000;
const TodoistApiPageSize = 100;
const TaskCacheTtlInMs = 60 * 1000;

export class TodoistCacheManager {
    private labels: TodoistEntity[] = [];
    private projects: TodoistEntity[] = [];
    private labelNameById = new Map<string, string>();
    private projectNameById = new Map<string, string>();
    private currentApiToken = "";
    private isRefreshingEntities = false;

    private currentTaskFilter = "";
    private tasks: Task[] = [];
    private tasksCacheExpiresAt = 0;
    private tasksFetchPromise?: Promise<void>;
    private lastTaskLoadError?: string;
    private pendingTaskIssues: TodoistTaskIssue[] = [];
    private lastTaskFilterError = false;

    public constructor(
        private readonly settingsManager: SettingsManager,
        private readonly taskScheduler: TaskScheduler,
        private readonly todoistApiFactory: TodoistApiFactory,
        private readonly logger: Logger,
    ) {}

    public initialize(): void {
        this.currentTaskFilter = this.getTaskFilter();
        void this.refreshEntityCaches();
    }

    public ensureEntitiesUpToDate(): void {
        const apiToken = this.getApiToken();

        if (apiToken === this.currentApiToken) {
            return;
        }

        this.currentApiToken = apiToken;
        this.labels = [];
        this.projects = [];
        this.labelNameById.clear();
        this.projectNameById.clear();
        this.resetTaskCache();

        if (!this.isRefreshingEntities) {
            void this.refreshEntityCaches();
        }
    }

    public async ensureTasks(): Promise<void> {
        const filter = this.getTaskFilter();

        if (filter !== this.currentTaskFilter) {
            this.currentTaskFilter = filter;
            this.resetTaskCache();
        }

        const hasValidCache = Date.now() < this.tasksCacheExpiresAt && !this.lastTaskLoadError;

        if (hasValidCache) {
            return;
        }

        if (this.tasksFetchPromise) {
            // Do not piggyback on an in-flight fetch; return early.
            // Callers decide when/how to resync their UI.
            return;
        }

        this.tasksFetchPromise = this.fetchTasksAndUpdate()
            .catch((error) => {
                this.logger.error(
                    `Todoist tasks refresh promise failed. Reason: ${error instanceof Error ? error.message : error}`,
                );
            })
            .finally(() => {
                this.tasksFetchPromise = undefined;
            });

        await this.tasksFetchPromise;
    }

    public getLabels(): TodoistEntity[] {
        return this.labels;
    }

    public getProjects(): TodoistEntity[] {
        return this.projects;
    }

    public getLabelName(labelId: string): string | undefined {
        return this.labelNameById.get(labelId);
    }

    public getProjectName(projectId: string): string | undefined {
        return this.projectNameById.get(projectId);
    }

    // Note: The data layer does not keep any search term; UI orchestrates it.

    public getTaskSnapshot(): TodoistTaskSnapshot {
        return {
            tasks: this.tasks,
            lastError: this.lastTaskLoadError,
            lastFilterError: this.lastTaskFilterError,
            isRefreshing: Boolean(this.tasksFetchPromise),
        };
    }

    public reportTaskIssue(issue: { searchTerm: string; message: string }): void {
        const enriched: TodoistTaskIssue = {
            message: issue.message,
            searchTerm: issue.searchTerm,
            timestamp: Date.now(),
        };
        this.pendingTaskIssues.push(enriched);
    }

    public consumeTaskIssues(searchTerm: string): TodoistTaskIssue[] {
        const issues = this.pendingTaskIssues.filter((issue) => issue.searchTerm === searchTerm);
        this.pendingTaskIssues = this.pendingTaskIssues.filter((issue) => issue.searchTerm !== searchTerm);
        return issues;
    }

    public async refreshAllCaches(): Promise<void> {
        this.resetTaskCache();
        this.currentTaskFilter = this.getTaskFilter();
        await Promise.all([this.refreshEntityCaches(), this.refreshTasks()]);
        // Make sure subsequent task-list searches always fetch fresh data even if
        // a recent Quick Add or server-side delay caused the immediate refresh
        // to miss the latest tasks.
        this.tasksCacheExpiresAt = 0;
    }

    public async refreshTasks(): Promise<void> {
        const filter = this.getTaskFilter();

        if (filter !== this.currentTaskFilter) {
            this.currentTaskFilter = filter;
            this.resetTaskCache();
        }

        this.lastTaskFilterError = false;

        if (this.tasksFetchPromise) {
            try {
                await this.tasksFetchPromise;
            } catch {
                // ignore
            }
        }

        await this.fetchTasksAndUpdate();
    }

    private resetTaskCache(): void {
        this.tasks = [];
        this.tasksCacheExpiresAt = 0;
        this.lastTaskLoadError = undefined;
        this.lastTaskFilterError = false;
    }

    // Note: UI notifications are intentionally not handled in this data layer.

    private getApiToken(): string {
        return this.settingsManager.getValue<string>(
            getExtensionSettingKey(TodoistExtensionId, "apiToken"),
            todoistDefaultSettings.apiToken,
            true,
        );
    }

    private getTaskFilter(): string {
        // Note: Although SettingsManager.getValue<T> provides a compile-time generic,
        // settings are persisted as JSON (and some values may also be encrypted/decrypted).
        // Users can hand-edit the file or older versions may have left incompatible types.
        // Therefore we defensively validate the runtime type here instead of trusting T.
        const value = this.settingsManager.getValue<string>(
            getExtensionSettingKey(TodoistExtensionId, "taskFilter"),
            todoistDefaultSettings.taskFilter,
        );

        if (typeof value !== "string") {
            return "";
        }

        return value.trim();
    }

    private scheduleNextEntityRefresh(): void {
        this.taskScheduler.scheduleTask(() => {
            void this.refreshEntityCaches();
        }, CacheRefreshIntervalInMs);
    }

    private async refreshEntityCaches(): Promise<void> {
        if (this.isRefreshingEntities) {
            return;
        }

        this.isRefreshingEntities = true;

        try {
            const apiToken = this.getApiToken();
            this.currentApiToken = apiToken;

            if (!apiToken) {
                this.labels = [];
                this.projects = [];
                this.labelNameById.clear();
                this.projectNameById.clear();
                return;
            }

            const api = this.todoistApiFactory.create(apiToken);
            const [labels, projects] = await Promise.all([
                new TodoistEntityFetcher(api.getLabels.bind(api), this.logger, "labels").fetchAll(TodoistApiPageSize),
                new TodoistEntityFetcher(api.getProjects.bind(api), this.logger, "projects").fetchAll(
                    TodoistApiPageSize,
                ),
            ]);

            this.labels = TodoistCacheManager.mapEntities(labels);
            this.projects = TodoistCacheManager.mapEntities(projects);
            this.labelNameById = new Map(this.labels.map((label) => [label.id, label.name]));
            this.projectNameById = new Map(this.projects.map((project) => [project.id, project.name]));
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to refresh Todoist entity cache. Reason: ${message}`);
        } finally {
            this.isRefreshingEntities = false;
            this.scheduleNextEntityRefresh();
        }
    }

    private async fetchTasksAndUpdate(): Promise<void> {
        if (!this.getApiToken()) {
            this.resetTaskCache();
            return;
        }

        try {
            const tasks = await this.fetchTasksFromApi();
            this.tasks = tasks;
            this.lastTaskLoadError = undefined;
            this.tasksCacheExpiresAt = Date.now() + TaskCacheTtlInMs;
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to refresh Todoist tasks. Reason: ${message}`);
            this.tasksCacheExpiresAt = Date.now();

            if (this.lastTaskFilterError) {
                this.lastTaskLoadError = undefined;
            } else {
                this.lastTaskLoadError = message;
            }
        }
    }

    private async fetchTasksFromApi(): Promise<Task[]> {
        const apiToken = this.getApiToken();

        if (!apiToken) {
            return [];
        }

        const api = this.todoistApiFactory.create(apiToken);
        const pageSize = TodoistApiPageSize;
        const filter = this.getTaskFilter();

        const fetcher = filter.length
            ? new TodoistEntityFetcher(
                  ({ limit, cursor }) =>
                      api.getTasksByFilter({
                          query: filter,
                          limit,
                          cursor: cursor ?? undefined,
                      }),
                  this.logger,
                  "tasks",
              )
            : new TodoistEntityFetcher(api.getTasks.bind(api), this.logger, "tasks");

        try {
            const tasks = await fetcher.fetchAll(pageSize);
            this.lastTaskFilterError = false;
            return [...tasks].sort(TodoistCacheManager.compareTasks);
        } catch (error) {
            if (error instanceof TodoistRequestError && error.httpStatusCode === 400) {
                this.lastTaskFilterError = true;
            }

            throw error;
        }
    }

    private static mapEntities(entities: Array<{ id: string | number; name?: string | null }>): TodoistEntity[] {
        return entities
            .filter((entity) => typeof entity.name === "string" && entity.name.trim().length > 0)
            .map((entity) => ({ id: String(entity.id), name: (entity.name ?? "").trim() }));
    }

    private static compareTasks(a: Task, b: Task): number {
        const dueKeyA = TodoistCacheManager.createDueSortKey(a);
        const dueKeyB = TodoistCacheManager.createDueSortKey(b);
        const dueComparison = dueKeyA.localeCompare(dueKeyB);

        if (dueComparison !== 0) {
            return dueComparison;
        }

        const addedKeyA = a.addedAt ?? "~~~~";
        const addedKeyB = b.addedAt ?? "~~~~";

        return addedKeyA.localeCompare(addedKeyB);
    }

    private static createDueSortKey(task: Task): string {
        if (task.due?.datetime) {
            return task.due.datetime;
        }

        if (task.due?.date) {
            return `${task.due.date}T23:59:59`;
        }

        return "~~~~";
    }
}
