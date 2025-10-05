import { type InstantSearchResultItems, type SearchResultItem } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import type { Settings } from "@common/Extensions/Todoist";
import type { Extension } from "@Core/Extension";
import type { TodoistCacheManager } from "./Caching";
import type { TodoistQuickAddProvider, TodoistTaskListProvider } from "./Search";
import { getTodoistI18nResources, todoistDefaultSettings, todoistTranslationNamespace } from "./Shared";

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

    private readonly defaultSettings: Settings = todoistDefaultSettings;

    private readonly image: Image;

    public constructor(
        image: Image,
        private readonly cacheManager: TodoistCacheManager,
        private readonly quickAddProvider: TodoistQuickAddProvider,
        private readonly taskListProvider: TodoistTaskListProvider,
    ) {
        this.image = image;
        this.cacheManager.initialize();
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
        const quickAddItems = this.quickAddProvider.createItems(searchTerm);
        const taskListItems = this.taskListProvider.createItems(searchTerm);

        return TodoistExtension.joinItems(quickAddItems, taskListItems);
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
            await this.cacheManager.refreshAllCaches();
            return { status: "ok" };
        }

        throw new Error(`Unsupported Todoist extension invocation type: ${type ?? "unknown"}`);
    }

    public async refreshAllCaches(): Promise<void> {
        await this.cacheManager.refreshAllCaches();
    }

    public async reloadTasks(searchTerm: string): Promise<void> {
        await this.cacheManager.refreshTasks(searchTerm);
    }

    public reportTaskOpenIssue(issue: { searchTerm: string; message: string }): void {
        this.cacheManager.reportTaskIssue(issue);
    }

    private static hasItems(result: InstantSearchResultItems): boolean {
        return result.before.length > 0 || result.after.length > 0;
    }

    private static joinItems(a: InstantSearchResultItems, b: InstantSearchResultItems): InstantSearchResultItems {
        return {
            before: [...a.before, ...b.before],
            after: [...a.after, ...b.after],
        };
    }

}
