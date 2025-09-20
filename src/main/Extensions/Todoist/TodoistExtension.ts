import { createEmptyInstantSearchResult, type InstantSearchResultItems, type SearchResultItem } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import type { Settings } from "@common/Extensions/Todoist";
import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { Logger } from "@Core/Logger";
import type { SettingsManager } from "@Core/SettingsManager";
import type { TaskScheduler } from "@Core/TaskScheduler";
import type { Translator } from "@Core/Translator";
import type { TodoistApiFactory } from "./TodoistApiFactory";
import { TodoistEntityFetcher } from "./TodoistEntityFetcher";
import { QuickAddHandlerId } from "./TodoistQuickAddActionHandler";
import { SetSearchTermHandlerId } from "./TodoistSetSearchTermActionHandler";
import { getTodoistI18nResources, todoistTranslationNamespace } from "./TodoistTranslations";
const CacheRefreshIntervalInMs = 5 * 60 * 1000;
const TodoistApiPageSize = 100;

type TodoistEntity = {
    id: string;
    name: string;
};

type Trigger = {
    symbol: "@" | "#" | "!";
    fragment: string;
    bodyWithoutTrigger: string;
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
        prefix: "todo",
        suggestionLimit: 15,
        apiToken: "",
    };

    private readonly image: Image;

    private labels: TodoistEntity[] = [];
    private projects: TodoistEntity[] = [];
    private currentApiToken = "";
    private isRefreshing = false;

    public constructor(
        private readonly assetPathResolver: AssetPathResolver,
        private readonly settingsManager: SettingsManager,
        private readonly translator: Translator,
        private readonly taskScheduler: TaskScheduler,
        private readonly todoistApiFactory: TodoistApiFactory,
        private readonly logger: Logger,
    ) {
        this.image = {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "todoist.svg")}`,
        };

        void this.refreshCache();
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
        const prefixMatch = this.createPrefixRegExp().exec(searchTerm);

        if (!prefixMatch) {
            return createEmptyInstantSearchResult();
        }

        this.ensureCacheIsUpToDate();

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

    public getSettingKeysTriggeringRescan(): string[] {
        return [
            getExtensionSettingKey(this.id, "prefix"),
            getExtensionSettingKey(this.id, "suggestionLimit"),
            getExtensionSettingKey(this.id, "apiToken"),
        ];
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
            description: t("quickAddDescription", { ns: todoistTranslationNamespace }),
            image: this.image,
            details: prefixPart + body,
            defaultAction: {
                handlerId: QuickAddHandlerId,
                argument: JSON.stringify({ text: body }),
                description: t("quickAddDescription", { ns: todoistTranslationNamespace }),
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
                        descriptionKey: "labelSuggestionDescription",
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
                        descriptionKey: "projectSuggestionDescription",
                        t,
                    }),
                );
        }

        const priorities = ["!1", "!2", "!3", "!4"]
            .filter((priority) => {
                if (trigger.fragment.length === 0) {
                    return true;
                }

                const searchable = `${priority}${priority.replace("!", "p")}`;
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
                descriptionKey: "prioritySuggestionDescription",
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
            description: t(descriptionKey, { ns: todoistTranslationNamespace }),
            image: this.image,
            defaultAction: {
                handlerId: SetSearchTermHandlerId,
                argument: JSON.stringify({ newSearchTerm }),
                description: t("applySuggestionDescription", { ns: todoistTranslationNamespace }),
                descriptionTranslation: {
                    key: "applySuggestionDescription",
                    namespace: todoistTranslationNamespace,
                },
            },
        };
    }

    private createPrefixRegExp(): RegExp {
        const prefix = this.getPrefix();
        return new RegExp(`^${TodoistExtension.escapeRegExp(prefix)}\\s+`, "i");
    }

    private getPrefix(): string {
        const value = this.settingsManager.getValue<string>(
            getExtensionSettingKey(this.id, "prefix"),
            this.defaultSettings.prefix,
        );

        return typeof value === "string" && value.trim().length > 0 ? value.trim() : this.defaultSettings.prefix;
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

    private ensureCacheIsUpToDate(): void {
        const apiToken = this.getApiToken();

        if (apiToken !== this.currentApiToken && !this.isRefreshing) {
            void this.refreshCache();
        }
    }

    private getApiToken(): string {
        return this.settingsManager.getValue<string>(
            getExtensionSettingKey(this.id, "apiToken"),
            this.defaultSettings.apiToken,
            true,
        );
    }

    private async refreshCache(): Promise<void> {
        if (this.isRefreshing) {
            return;
        }

        this.isRefreshing = true;

        try {
            const apiToken = this.getApiToken();
            this.currentApiToken = apiToken;

            if (!apiToken) {
                this.labels = [];
                this.projects = [];
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
        } catch (error) {
            this.logger.error(
                `Failed to refresh Todoist cache. Reason: ${error instanceof Error ? error.message : error}`,
            );
        } finally {
            this.isRefreshing = false;
            this.scheduleNextRefresh();
        }
    }

    private scheduleNextRefresh(): void {
        this.taskScheduler.scheduleTask(() => {
            void this.refreshCache();
        }, CacheRefreshIntervalInMs);
    }

    private static escapeRegExp(value: string): string {
        return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    private static mapEntities(entities: Array<{ id: string | number; name?: string | null }>): TodoistEntity[] {
        return entities
            .filter((entity) => typeof entity.name === "string" && entity.name.trim().length > 0)
            .map((entity) => ({ id: String(entity.id), name: (entity.name ?? "").trim() }));
    }
}
