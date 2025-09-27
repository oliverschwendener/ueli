import type { InstantSearchResultItems, SearchResultItem } from "@common/Core";
import { createEmptyInstantSearchResult } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import { QuickAddHandlerId, SetSearchTermHandlerId } from "../../Actions";
import type { TodoistCacheManager } from "../../Caching";
import type { TodoistTrigger } from "../../Shared";
import { getTodoistI18nResources, todoistDefaultSettings, todoistTranslationNamespace } from "../../Shared";

const TodoistExtensionId = "Todoist";

export class TodoistQuickAddProvider {
    public constructor(
        private readonly cacheManager: TodoistCacheManager,
        private readonly settingsManager: SettingsManager,
        private readonly translator: Translator,
        private readonly image: Image,
    ) {}

    public createItems(searchTerm: string): InstantSearchResultItems {
        const quickAddMatch = this.createQuickAddPrefixRegExp().exec(searchTerm);

        if (!quickAddMatch) {
            return createEmptyInstantSearchResult();
        }

        this.cacheManager.ensureEntitiesUpToDate();

        const { t } = this.translator.createT(getTodoistI18nResources());
        const prefixPart = quickAddMatch[0];
        const body = searchTerm.slice(prefixPart.length);
        const bodyTrimmed = body.trim();

        const quickAddItem = bodyTrimmed.length
            ? this.createQuickAddItem({ body: bodyTrimmed, prefixPart, t })
            : undefined;
        const trigger = this.extractTrigger(body);
        const suggestions = trigger ? this.createSuggestions({ trigger, prefixPart, t }) : [];

        return {
            before: quickAddItem ? [quickAddItem] : [],
            after: suggestions,
        };
    }

    private createQuickAddItem({
        body,
        prefixPart,
        t,
    }: {
        body: string;
        prefixPart: string;
        t: ReturnType<Translator["createT"]>["t"];
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
        trigger: TodoistTrigger;
        prefixPart: string;
        t: ReturnType<Translator["createT"]>["t"];
    }): SearchResultItem[] {
        const suggestionLimit = this.getSuggestionLimit();

        if (trigger.symbol === "@") {
            return this.cacheManager
                .getLabels()
                .filter((label) => this.matchesFragment(label.name, trigger.fragment))
                .slice(0, suggestionLimit)
                .map((label) =>
                    this.createSuggestionItem({
                        id: `todoist-label-${label.id}`,
                        token: `@${label.name}`,
                        trigger,
                        prefixPart,
                        descriptionKey: "applySuggestionDescription",
                        nameOverride: undefined,
                        t,
                    }),
                );
        }

        if (trigger.symbol === "#") {
            return this.cacheManager
                .getProjects()
                .filter((project) => this.matchesFragment(project.name, trigger.fragment))
                .slice(0, suggestionLimit)
                .map((project) =>
                    this.createSuggestionItem({
                        id: `todoist-project-${project.id}`,
                        token: `#${project.name}`,
                        trigger,
                        prefixPart,
                        descriptionKey: "applySuggestionDescription",
                        nameOverride: undefined,
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

        return priorities.map((priority) =>
            this.createSuggestionItem({
                id: `todoist-priority-${priority}`,
                token: priority,
                trigger,
                prefixPart,
                descriptionKey: "applySuggestionDescription",
                nameOverride: priority,
                t,
            }),
        );
    }

    private createSuggestionItem({
        id,
        token,
        trigger,
        prefixPart,
        descriptionKey,
        nameOverride,
        t,
    }: {
        id: string;
        token: string;
        trigger: TodoistTrigger;
        prefixPart: string;
        descriptionKey: string;
        nameOverride?: string;
        t: ReturnType<Translator["createT"]>["t"];
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
        return new RegExp(`^${TodoistQuickAddProvider.escapeRegExp(prefix)}\\s+`, "i");
    }

    private extractTrigger(body: string): TodoistTrigger | undefined {
        const bodyWithoutTrailingSpaces = body.replace(/\s+$/, "");

        if (bodyWithoutTrailingSpaces.length === 0) {
            return undefined;
        }

        const triggerMatch = /(?:^|\s)([@#!])([^\s]*)$/.exec(bodyWithoutTrailingSpaces);

        if (!triggerMatch) {
            return undefined;
        }

        const symbol = triggerMatch[1] as TodoistTrigger["symbol"];
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

    private getQuickAddPrefix(): string {
        const value = this.settingsManager.getValue<string>(
            getExtensionSettingKey(TodoistExtensionId, "quickAddPrefix"),
            todoistDefaultSettings.quickAddPrefix,
        );

        return typeof value === "string" && value.trim().length > 0
            ? value.trim()
            : todoistDefaultSettings.quickAddPrefix;
    }

    private getSuggestionLimit(): number {
        const value = this.settingsManager.getValue<number>(
            getExtensionSettingKey(TodoistExtensionId, "suggestionLimit"),
            todoistDefaultSettings.suggestionLimit,
        );

        if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
            return todoistDefaultSettings.suggestionLimit;
        }

        return Math.floor(value);
    }

    private static escapeRegExp(value: string): string {
        return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
}
