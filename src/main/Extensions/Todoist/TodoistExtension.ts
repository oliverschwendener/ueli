import { createEmptyInstantSearchResult, type InstantSearchResultItems, type SearchResultItem } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import type { Settings, TaskOpenTarget } from "@common/Extensions/Todoist";
import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { BrowserWindowNotifier } from "@Core/BrowserWindowNotifier";
import type { Extension } from "@Core/Extension";
import type { Logger } from "@Core/Logger";
import type { SettingsManager } from "@Core/SettingsManager";
import type { TaskScheduler } from "@Core/TaskScheduler";
import type { Translator } from "@Core/Translator";
import type { Task } from "@doist/todoist-api-typescript";
import { TodoistRequestError } from "@doist/todoist-api-typescript";
import type { TodoistApiFactory } from "./TodoistApiFactory";
import { TodoistEntityFetcher } from "./TodoistEntityFetcher";
import { TodoistOpenTaskHandlerId } from "./TodoistOpenTaskActionHandler";
import { QuickAddHandlerId } from "./TodoistQuickAddActionHandler";
import { RefreshCachesHandlerId } from "./TodoistRefreshCachesActionHandler";
import { SetSearchTermHandlerId } from "./TodoistSetSearchTermActionHandler";
import { getTodoistI18nResources, todoistTranslationNamespace } from "./TodoistTranslations";

const CacheRefreshIntervalInMs = 5 * 60 * 1000;
const TodoistApiPageSize = 100;
const TaskCacheTtlInMs = 60 * 1000;

type TodoistEntity = {
    id: string;
    name: string;
};

type Trigger = {
    symbol: "@" | "#" | "!";
    fragment: string;
    bodyWithoutTrigger: string;
};

type TaskIssue = {
    message: string;
    searchTerm: string;
    timestamp: number;
};

export class TodoistExtension implements Extension {
    public readonly id = "Todoist";

    public readonly name = "Todoist";

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: todoistTranslationNamespace,
    };

    public readonly author = {
        name: "coucha",
        githubUserName: "cou723",
    };

    private readonly defaultSettings: Settings = {
        quickAddPrefix: "todo",
        taskListPrefix: "tdl",
        suggestionLimit: 15,
        taskListLimit: 30,
        taskOpenTarget: "browser",
        taskFilter: "",
        apiToken: "",
    };

    private readonly image: Image;

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
    private pendingTaskIssues: TaskIssue[] = [];
    private lastTaskFilterError = false;

    public constructor(
        private readonly assetPathResolver: AssetPathResolver,
        private readonly settingsManager: SettingsManager,
        private readonly translator: Translator,
        private readonly taskScheduler: TaskScheduler,
        private readonly todoistApiFactory: TodoistApiFactory,
        private readonly logger: Logger,
        private readonly browserWindowNotifier: BrowserWindowNotifier,
    ) {
        this.image = {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "todoist.svg")}`,
        };

        this.currentTaskFilter = this.getTaskFilter();

        void this.refreshEntityCaches();
    }

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        return [];
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue(key: keyof Settings) {
        return this.defaultSettings[key];
    }

    public getImage(): Image {
        return this.image;
    }

    public getI18nResources() {
        return getTodoistI18nResources();
    }

    public getInstantSearchResultItems(searchTerm: string): InstantSearchResultItems {
        const quickAddMatch = this.createQuickAddPrefixRegExp().exec(searchTerm);

        if (quickAddMatch) {
            return this.createQuickAddItems(searchTerm, quickAddMatch);
        }

        const taskListMatch = this.createTaskListPrefixRegExp().exec(searchTerm);

        if (taskListMatch) {
            return this.createTaskListItems(searchTerm, taskListMatch);
        }

        return createEmptyInstantSearchResult();
    }

    public getSettingKeysTriggeringRescan(): string[] {
        return [
            getExtensionSettingKey(this.id, "quickAddPrefix"),
            getExtensionSettingKey(this.id, "taskListPrefix"),
            getExtensionSettingKey(this.id, "suggestionLimit"),
            getExtensionSettingKey(this.id, "taskListLimit"),
            getExtensionSettingKey(this.id, "taskOpenTarget"),
            getExtensionSettingKey(this.id, "taskFilter"),
            getExtensionSettingKey(this.id, "apiToken"),
        ];
    }

    public async invoke(argument: unknown): Promise<unknown> {
        if (!argument || typeof argument !== "object") {
            throw new Error("Unsupported Todoist extension invocation argument.");
        }

        const { type } = argument as { type?: string };

        if (type === "refreshCaches") {
            await this.refreshAllCaches();
            return { status: "ok" };
        }

        throw new Error(`Unsupported Todoist extension invocation type: ${type ?? "unknown"}`);
    }

    public async refreshAllCaches(): Promise<void> {
        this.tasksCacheExpiresAt = 0;
        this.lastTaskLoadError = undefined;
        this.lastTaskFilterError = false;
        this.currentTaskFilter = this.getTaskFilter();

        await Promise.all([this.refreshEntityCaches(), this.executeTasksRefresh({ force: true })]);
    }

    public async reloadTasks(searchTerm: string): Promise<void> {
        this.currentTaskFilter = this.getTaskFilter();
        this.lastTaskFilterError = false;
        await this.executeTasksRefresh({ force: true, searchTerm });
    }

    public reportTaskOpenIssue(issue: { searchTerm: string; message: string }): void {
        this.pendingTaskIssues.push({
            message: issue.message,
            searchTerm: issue.searchTerm,
            timestamp: Date.now(),
        });
        this.notifySearchTerm(issue.searchTerm);
    }

    private createQuickAddItems(searchTerm: string, prefixMatch: RegExpExecArray): InstantSearchResultItems {
        this.ensureEntityCacheIsUpToDate();

        const { t } = this.translator.createT(getTodoistI18nResources());

        const prefixPart = prefixMatch[0];
        const body = searchTerm.slice(prefixPart.length);
        const bodyTrimmed = body.trim();

        const quickAddItem = bodyTrimmed.length
            ? this.createQuickAddItem({ body: bodyTrimmed, t, prefixPart })
            : undefined;

        const trigger = this.extractTrigger(body);
        const suggestions = trigger ? this.createSuggestions({ trigger, prefixPart, t }) : [];

        return {
            before: quickAddItem ? [quickAddItem] : [],
            after: suggestions,
        };
    }

    private createTaskListItems(searchTerm: string, prefixMatch: RegExpExecArray): InstantSearchResultItems {
        this.ensureEntityCacheIsUpToDate();

        const { t } = this.translator.createT(getTodoistI18nResources());

        const prefixPart = prefixMatch[0];
        const filter = searchTerm.slice(prefixPart.length).trim();

        this.lastTaskListSearchTerm = searchTerm;

        if (!this.getApiToken()) {
            return {
                before: [],
                after: [this.createMissingTokenItem(t, searchTerm)],
            };
        }

        this.ensureTasksCache(searchTerm);

        const beforeItems: SearchResultItem[] = [this.createTaskReloadItem(searchTerm, t)];
        const afterItems: SearchResultItem[] = [];

        const issuesForTerm = this.pendingTaskIssues.filter((issue) => issue.searchTerm === searchTerm);

        if (issuesForTerm.length > 0) {
            for (const issue of issuesForTerm) {
                beforeItems.unshift(this.createTaskErrorItem(issue.message, searchTerm, t));
            }

            this.pendingTaskIssues = this.pendingTaskIssues.filter((issue) => issue.searchTerm !== searchTerm);
        }

        const isLoading = Boolean(this.tasksFetchPromise);
        const hadError = typeof this.lastTaskLoadError === "string";

        if (isLoading && this.tasks.length === 0 && !hadError) {
            afterItems.push(this.createTaskLoadingItem(t, searchTerm));
            return { before: beforeItems, after: afterItems };
        }

        if (hadError && this.tasks.length === 0) {
            const message = this.lastTaskLoadError ?? t("taskListError");
            afterItems.push(this.createTaskErrorItem(message, searchTerm, t));
            return { before: beforeItems, after: afterItems };
        }

        const filteredTasks = this.filterTasks(filter).slice(0, this.getTaskListLimit());

        if (!isLoading && filteredTasks.length === 0) {
            afterItems.push(this.createTaskEmptyItem(t, searchTerm));
            return { before: beforeItems, after: afterItems };
        }

        const defaultTarget = this.getTaskOpenTarget();

        for (const task of filteredTasks) {
            afterItems.push(this.createTaskSearchResultItem({ task, searchTerm, defaultTarget, t }));
        }

        if (isLoading && this.tasks.length > 0) {
            afterItems.push(this.createTaskLoadingItem(t, searchTerm));
        }

        return { before: beforeItems, after: afterItems };
    }

    private createQuickAddItem({
        body,
        t,
        prefixPart,
    }: {
        body: string;
        t: ReturnType<Translator["createT"]>["t"];
        prefixPart: string;
    }): SearchResultItem {
        return {
            id: "todoist-quick-add",
            name: body,
            description: t("quickAddDescription"),
            image: this.image,
            details: prefixPart + body,
            defaultAction: {
                handlerId: QuickAddHandlerId,
                argument: JSON.stringify({ text: body }),
                description: t("quickAddDescription"),
                descriptionTranslation: {
                    key: "quickAddDescription",
                    namespace: todoistTranslationNamespace,
                },
                hideWindowAfterInvocation: true,
            },
        };
    }

    private createSuggestions({
        trigger,
        prefixPart,
        t,
    }: {
        trigger: Trigger;
        prefixPart: string;
        t: ReturnType<Translator["createT"]>["t"];
    }): SearchResultItem[] {
        const suggestionLimit = this.getSuggestionLimit();

        if (trigger.symbol === "@") {
            return this.labels
                .filter((label) => this.matchesFragment(label.name, trigger.fragment))
                .slice(0, suggestionLimit)
                .map((label) =>
                    this.createSuggestionItem({
                        id: `todoist-label-${label.id}`,
                        token: `@${label.name}`,
                        trigger,
                        prefixPart,
                        descriptionKey: "applySuggestionDescription",
                        t,
                    }),
                );
        }

        if (trigger.symbol === "#") {
            return this.projects
                .filter((project) => this.matchesFragment(project.name, trigger.fragment))
                .slice(0, suggestionLimit)
                .map((project) =>
                    this.createSuggestionItem({
                        id: `todoist-project-${project.id}`,
                        token: `#${project.name}`,
                        trigger,
                        prefixPart,
                        descriptionKey: "applySuggestionDescription",
                        t,
                    }),
                );
        }

        const priorities = ["p1", "p2", "p3", "p4"]
            .filter((priority) => {
                if (trigger.fragment.length === 0) {
                    return true;
                }

                const priorityNumber = priority.slice(1);
                const searchable = `${priority}${priorityNumber}`;
                return searchable.toLowerCase().includes(trigger.fragment.toLowerCase());
            })
            .slice(0, suggestionLimit);

        return priorities.map((priority) => {
            const token = priority;

            return this.createSuggestionItem({
                id: `todoist-priority-${priority}`,
                token,
                trigger,
                prefixPart,
                descriptionKey: "applySuggestionDescription",
                t,
                nameOverride: priority,
            });
        });
    }

    private createSuggestionItem({
        id,
        token,
        trigger,
        prefixPart,
        descriptionKey,
        t,
        nameOverride,
    }: {
        id: string;
        token: string;
        trigger: Trigger;
        prefixPart: string;
        descriptionKey: string;
        t: ReturnType<Translator["createT"]>["t"];
        nameOverride?: string;
    }): SearchResultItem {
        const newBody = `${trigger.bodyWithoutTrigger}${token} `;
        const newSearchTerm = `${prefixPart}${newBody}`;

        return {
            id,
            name: nameOverride ?? token,
            description: t(descriptionKey),
            image: this.image,
            defaultAction: {
                handlerId: SetSearchTermHandlerId,
                argument: JSON.stringify({ newSearchTerm }),
                description: t("applySuggestionDefaultActionDescription"),
                descriptionTranslation: {
                    key: "applySuggestionDefaultActionDescription",
                    namespace: todoistTranslationNamespace,
                },
            },
        };
    }

    private createQuickAddPrefixRegExp(): RegExp {
        const prefix = this.getQuickAddPrefix();
        return new RegExp(`^${TodoistExtension.escapeRegExp(prefix)}\\s+`, "i");
    }

    private createTaskListPrefixRegExp(): RegExp {
        const prefix = this.getTaskListPrefix();
        return new RegExp(`^${TodoistExtension.escapeRegExp(prefix)}\\s*`, "i");
    }

    private getQuickAddPrefix(): string {
        const value = this.settingsManager.getValue<string>(
            getExtensionSettingKey(this.id, "quickAddPrefix"),
            this.defaultSettings.quickAddPrefix,
        );

        return typeof value === "string" && value.trim().length > 0
            ? value.trim()
            : this.defaultSettings.quickAddPrefix;
    }

    private getTaskListPrefix(): string {
        const value = this.settingsManager.getValue<string>(
            getExtensionSettingKey(this.id, "taskListPrefix"),
            this.defaultSettings.taskListPrefix,
        );

        return typeof value === "string" && value.trim().length > 0
            ? value.trim()
            : this.defaultSettings.taskListPrefix;
    }

    private getTaskListLimit(): number {
        const value = this.settingsManager.getValue<number>(
            getExtensionSettingKey(this.id, "taskListLimit"),
            this.defaultSettings.taskListLimit,
        );

        if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
            return this.defaultSettings.taskListLimit;
        }

        return Math.floor(value);
    }

    private getTaskOpenTarget(): TaskOpenTarget {
        const value = this.settingsManager.getValue<Settings["taskOpenTarget"]>(
            getExtensionSettingKey(this.id, "taskOpenTarget"),
            this.defaultSettings.taskOpenTarget,
        );

        return value === "desktopApp" ? "desktopApp" : "browser";
    }

    private getTaskFilter(): string {
        const value = this.settingsManager.getValue<string>(
            getExtensionSettingKey(this.id, "taskFilter"),
            this.defaultSettings.taskFilter,
        );

        if (typeof value !== "string") {
            return "";
        }

        return value.trim();
    }

    private getSuggestionLimit(): number {
        const value = this.settingsManager.getValue<number>(
            getExtensionSettingKey(this.id, "suggestionLimit"),
            this.defaultSettings.suggestionLimit,
        );

        if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
            return this.defaultSettings.suggestionLimit;
        }

        return Math.floor(value);
    }

    private matchesFragment(name: string, fragment: string): boolean {
        if (fragment.length === 0) {
            return true;
        }

        const nameLower = name.toLowerCase();
        const fragmentLower = fragment.toLowerCase();

        if (name.includes(" ") && nameLower === fragmentLower) {
            return false;
        }

        return nameLower.includes(fragmentLower);
    }

    private extractTrigger(body: string): Trigger | undefined {
        const bodyWithoutTrailingSpaces = body.replace(/\s+$/, "");

        if (bodyWithoutTrailingSpaces.length === 0) {
            return undefined;
        }

        const triggerMatch = /(?:^|\s)([@#!])([^\s]*)$/.exec(bodyWithoutTrailingSpaces);

        if (!triggerMatch) {
            return undefined;
        }

        const symbol = triggerMatch[1] as Trigger["symbol"];
        const fragment = triggerMatch[2] ?? "";

        const bodyWithoutTrigger = bodyWithoutTrailingSpaces.slice(
            0,
            bodyWithoutTrailingSpaces.length - fragment.length - 1,
        );

        return {
            symbol,
            fragment,
            bodyWithoutTrigger,
        };
    }

    private ensureEntityCacheIsUpToDate(): void {
        const apiToken = this.getApiToken();

        if (apiToken === this.currentApiToken) {
            return;
        }

        this.currentApiToken = apiToken;
        this.labels = [];
        this.projects = [];
        this.labelNameById.clear();
        this.projectNameById.clear();
        this.tasks = [];
        this.tasksCacheExpiresAt = 0;
        this.lastTaskLoadError = undefined;
        this.lastTaskFilterError = false;
        this.currentTaskFilter = this.getTaskFilter();

        if (!this.isRefreshingEntities) {
            void this.refreshEntityCaches();
        }
    }

    private getApiToken(): string {
        return this.settingsManager.getValue<string>(
            getExtensionSettingKey(this.id, "apiToken"),
            this.defaultSettings.apiToken,
            true,
        );
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

            this.labels = TodoistExtension.mapEntities(labels);
            this.projects = TodoistExtension.mapEntities(projects);
            this.labelNameById = new Map(this.labels.map((label) => [label.id, label.name]));
            this.projectNameById = new Map(this.projects.map((project) => [project.id, project.name]));
        } catch (error) {
            this.logger.error(
                `Failed to refresh Todoist entity cache. Reason: ${error instanceof Error ? error.message : error}`,
            );
        } finally {
            this.isRefreshingEntities = false;
            this.scheduleNextEntityRefresh();
        }
    }

    private scheduleNextEntityRefresh(): void {
        this.taskScheduler.scheduleTask(() => {
            void this.refreshEntityCaches();
        }, CacheRefreshIntervalInMs);
    }

    private ensureTasksCache(searchTerm: string): void {
        const filter = this.getTaskFilter();

        if (filter !== this.currentTaskFilter) {
            this.tasks = [];
            this.tasksCacheExpiresAt = 0;
            this.lastTaskLoadError = undefined;
            this.lastTaskFilterError = false;
            this.currentTaskFilter = filter;
        }

        const hasValidCache = Date.now() < this.tasksCacheExpiresAt && !this.lastTaskLoadError;

        if (hasValidCache) {
            return;
        }

        void this.executeTasksRefresh({ force: !hasValidCache, searchTerm });
    }

    private async executeTasksRefresh(
        { force, searchTerm }: { force: boolean; searchTerm?: string } = { force: false },
    ) {
        if (!this.getApiToken()) {
            this.tasks = [];
            this.tasksCacheExpiresAt = 0;
            this.lastTaskLoadError = undefined;

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

        const { t } = this.translator.createT(getTodoistI18nResources());

        const fetchPromise = (async () => {
            try {
                const tasks = await this.fetchTasksFromApi();
                this.tasks = tasks;
                this.lastTaskLoadError = undefined;
                this.tasksCacheExpiresAt = Date.now() + TaskCacheTtlInMs;
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                this.logger.error(`Failed to refresh Todoist tasks. Reason: ${message}`);
                this.lastTaskLoadError = this.lastTaskFilterError ? t("taskFilterInvalid") : message;
                this.tasksCacheExpiresAt = Date.now();
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
            return [...tasks].sort(TodoistExtension.compareTasks);
        } catch (error) {
            if (error instanceof TodoistRequestError && error.httpStatusCode === 400) {
                this.lastTaskFilterError = true;
            }

            throw error;
        }
    }

    private notifySearchTerm(searchTerm: string): void {
        this.browserWindowNotifier.notify({
            browserWindowId: "search",
            channel: "setSearchTerm",
            data: searchTerm,
        });
    }

    private filterTasks(filter: string): Task[] {
        if (!filter) {
            return this.tasks;
        }

        const filterLower = filter.toLowerCase();

        return this.tasks.filter((task) => {
            if (task.content.toLowerCase().includes(filterLower)) {
                return true;
            }

            const projectName = this.projectNameById.get(task.projectId);

            if (projectName && projectName.toLowerCase().includes(filterLower)) {
                return true;
            }

            for (const labelId of task.labels) {
                const labelName = this.labelNameById.get(labelId);

                if (labelName && labelName.toLowerCase().includes(filterLower)) {
                    return true;
                }
            }

            return false;
        });
    }

    private createTaskReloadItem(searchTerm: string, t: ReturnType<Translator["createT"]>["t"]): SearchResultItem {
        return {
            id: "todoist-task-reload",
            name: t("reloadTasks"),
            description: t("reloadTasksDescription"),
            image: this.image,
            defaultAction: {
                handlerId: RefreshCachesHandlerId,
                argument: JSON.stringify({ searchTerm }),
                description: t("reloadTasksDescription"),
                descriptionTranslation: {
                    key: "reloadTasksDescription",
                    namespace: todoistTranslationNamespace,
                },
            },
        };
    }

    private createTaskLoadingItem(t: ReturnType<Translator["createT"]>["t"], searchTerm: string): SearchResultItem {
        return {
            id: "todoist-task-loading",
            name: t("loadingTasks"),
            description: "",
            image: this.image,
            defaultAction: {
                handlerId: RefreshCachesHandlerId,
                argument: JSON.stringify({ searchTerm }),
                description: t("reloadTasksDescription"),
                descriptionTranslation: {
                    key: "reloadTasksDescription",
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
            description: t("reloadTasksDescription"),
            image: this.image,
            defaultAction: {
                handlerId: RefreshCachesHandlerId,
                argument: JSON.stringify({ searchTerm }),
                description: t("reloadTasksDescription"),
                descriptionTranslation: {
                    key: "reloadTasksDescription",
                    namespace: todoistTranslationNamespace,
                },
            },
        };
    }

    private createMissingTokenItem(t: ReturnType<Translator["createT"]>["t"], searchTerm: string): SearchResultItem {
        return {
            id: "todoist-task-missing-token",
            name: t("missingTokenTaskList"),
            description: t("reloadTasksDescription"),
            image: this.image,
            defaultAction: {
                handlerId: RefreshCachesHandlerId,
                argument: JSON.stringify({ searchTerm }),
                description: t("reloadTasksDescription"),
                descriptionTranslation: {
                    key: "reloadTasksDescription",
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
                description: t("reloadTasksDescription"),
                descriptionTranslation: {
                    key: "reloadTasksDescription",
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

        const defaultActionArgument = JSON.stringify({
            taskId: task.id,
            webUrl: task.url,
            desktopUrl,
            searchTerm,
        });

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
                argument: defaultActionArgument,
                description: t(defaultActionKey),
                descriptionTranslation: {
                    key: defaultActionKey,
                    namespace: todoistTranslationNamespace,
                },
            },
        };
    }

    private static escapeRegExp(value: string): string {
        return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    private static mapEntities(entities: Array<{ id: string | number; name?: string | null }>): TodoistEntity[] {
        return entities
            .filter((entity) => typeof entity.name === "string" && entity.name.trim().length > 0)
            .map((entity) => ({ id: String(entity.id), name: (entity.name ?? "").trim() }));
    }

    private static compareTasks(a: Task, b: Task): number {
        const dueKeyA = TodoistExtension.createDueSortKey(a);
        const dueKeyB = TodoistExtension.createDueSortKey(b);
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
