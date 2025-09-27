import type { BrowserWindowNotifier } from "@Core/BrowserWindowNotifier";
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
    private lastTaskListSearchTerm?: string;
    private pendingTaskIssues: TodoistTaskIssue[] = [];
    private lastTaskFilterError = false;

    public constructor(
        private readonly settingsManager: SettingsManager,
        private readonly taskScheduler: TaskScheduler,
        private readonly todoistApiFactory: TodoistApiFactory,
        private readonly logger: Logger,
        private readonly browserWindowNotifier: BrowserWindowNotifier,
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

    public async ensureTasks(options?: { force?: boolean; searchTerm?: string }): Promise<void> {
        const searchTerm = options?.searchTerm;
        const filter = this.getTaskFilter();

        if (filter !== this.currentTaskFilter) {
            this.currentTaskFilter = filter;
            this.resetTaskCache();
        }

        const hasValidCache = Date.now() < this.tasksCacheExpiresAt && !this.lastTaskLoadError;

        if (hasValidCache && !options?.force) {
            return;
        }

        await this.executeTasksRefresh({ force: options?.force ?? !hasValidCache, searchTerm });
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

    public setLastTaskListSearchTerm(searchTerm: string): void {
        this.lastTaskListSearchTerm = searchTerm;
    }

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
        this.notifySearchTerm(issue.searchTerm);
    }

    public consumeTaskIssues(searchTerm: string): TodoistTaskIssue[] {
        const issues = this.pendingTaskIssues.filter((issue) => issue.searchTerm === searchTerm);
        this.pendingTaskIssues = this.pendingTaskIssues.filter((issue) => issue.searchTerm !== searchTerm);
        return issues;
    }

    public async refreshAllCaches(): Promise<void> {
        this.resetTaskCache();
        this.currentTaskFilter = this.getTaskFilter();
        await Promise.all([this.refreshEntityCaches(), this.executeTasksRefresh({ force: true })]);
    }

    public async refreshTasks(searchTerm: string): Promise<void> {
        this.currentTaskFilter = this.getTaskFilter();
        this.lastTaskFilterError = false;
        await this.executeTasksRefresh({ force: true, searchTerm });
    }

    private resetTaskCache(): void {
        this.tasks = [];
        this.tasksCacheExpiresAt = 0;
        this.lastTaskLoadError = undefined;
        this.lastTaskFilterError = false;
    }

    private notifySearchTerm(searchTerm: string): void {
        this.browserWindowNotifier.notify({
            browserWindowId: "search",
            channel: "setSearchTerm",
            data: searchTerm,
        });
    }

    private getApiToken(): string {
        return this.settingsManager.getValue<string>(
            getExtensionSettingKey(TodoistExtensionId, "apiToken"),
            todoistDefaultSettings.apiToken,
            true,
        );
    }

    private getTaskListLimit(): number {
        const value = this.settingsManager.getValue<number>(
            getExtensionSettingKey(TodoistExtensionId, "taskListLimit"),
            todoistDefaultSettings.taskListLimit,
        );

        if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
            return todoistDefaultSettings.taskListLimit;
        }

        return Math.floor(value);
    }

    private getTaskFilter(): string {
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

    private async executeTasksRefresh({ force, searchTerm }: { force: boolean; searchTerm?: string }): Promise<void> {
        if (!this.getApiToken()) {
            this.resetTaskCache();

            if (searchTerm) {
                this.notifySearchTerm(searchTerm);
            }

            return;
        }

        if (!force && this.tasksFetchPromise) {
            if (searchTerm) {
                this.tasksFetchPromise
                    .finally(() => {
                        this.notifySearchTerm(searchTerm);
                    })
                    .catch(() => undefined);
            }

            return;
        }

        if (this.tasksFetchPromise) {
            await this.tasksFetchPromise;
        }

        const fetchPromise = (async () => {
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
        })()
            .catch((error) => {
                this.logger.error(
                    `Todoist tasks refresh promise failed. Reason: ${error instanceof Error ? error.message : error}`,
                );
            })
            .finally(() => {
                if (this.tasksFetchPromise === fetchPromise) {
                    this.tasksFetchPromise = undefined;
                }

                if (searchTerm) {
                    this.notifySearchTerm(searchTerm);
                } else if (this.lastTaskListSearchTerm) {
                    this.notifySearchTerm(this.lastTaskListSearchTerm);
                }
            });

        this.tasksFetchPromise = fetchPromise;

        await fetchPromise;
    }

    private async fetchTasksFromApi(): Promise<Task[]> {
        const apiToken = this.getApiToken();

        if (!apiToken) {
            return [];
        }

        const api = this.todoistApiFactory.create(apiToken);
        const limit = this.getTaskListLimit();
        const pageSize = Math.min(TodoistApiPageSize, limit);
        const filter = this.getTaskFilter();

        const fetcher = filter.length
            ? new TodoistEntityFetcher(
                  ({ limit: pageLimit, cursor }) =>
                      api.getTasksByFilter({
                          query: filter,
                          limit: pageLimit,
                          cursor: cursor ?? undefined,
                      }),
                  this.logger,
                  "tasks",
              )
            : new TodoistEntityFetcher(api.getTasks.bind(api), this.logger, "tasks");

        try {
            const tasks = await fetcher.fetchAll(pageSize, { maxResults: limit });
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
