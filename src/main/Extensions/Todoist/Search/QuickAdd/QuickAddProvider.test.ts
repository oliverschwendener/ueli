import type { InstantSearchResultItems } from "@common/Core";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import { describe, expect, it, vi } from "vitest";
import type { TodoistCacheManager } from "../../Caching";
import { getTodoistI18nResources } from "../../Shared";
import { TodoistQuickAddProvider } from "./QuickAddProvider";

const resources = getTodoistI18nResources();

const createTranslator = (): Translator => ({
    createT: () => ({
        t: (key: string, options?: Record<string, string>) => {
            const dictionary = resources["en-US"] as Record<string, string>;
            const value = dictionary[key];

            if (!value) {
                return key;
            }

            if (options?.priority) {
                return value.replace("{{priority}}", options.priority);
            }

            return value;
        },
    }),
});

describe(TodoistQuickAddProvider, () => {
    const createSettingsManager = (overrides?: {
        quickAddPrefix?: string;
        suggestionLimit?: number;
    }): SettingsManager => {
        const map = new Map<string, unknown>();
        map.set("extension[Todoist].quickAddPrefix", overrides?.quickAddPrefix ?? "todo");
        map.set("extension[Todoist].suggestionLimit", overrides?.suggestionLimit ?? 15);
        return {
            getValue: <T>(key: string, defaultValue: T) => (map.has(key) ? (map.get(key) as T) : defaultValue),
            updateValue: vi.fn(),
        };
    };

    const createCacheManager = (
        labels: Array<{ id: string; name: string }>,
        projects: Array<{ id: string; name: string }>,
    ) => {
        const cacheManager: Pick<TodoistCacheManager, "ensureEntitiesUpToDate" | "getLabels" | "getProjects"> = {
            ensureEntitiesUpToDate: vi.fn(),
            getLabels: () => labels,
            getProjects: () => projects,
        };

        return cacheManager as TodoistCacheManager;
    };

    const createProvider = (options?: {
        labels?: Array<{ id: string; name: string }>;
        projects?: Array<{ id: string; name: string }>;
        settingsOverrides?: {
            quickAddPrefix?: string;
            suggestionLimit?: number;
        };
    }) =>
        new TodoistQuickAddProvider(
            createCacheManager(options?.labels ?? [], options?.projects ?? []),
            createSettingsManager(options?.settingsOverrides),
            createTranslator(),
            { url: "file:///todoist.svg" },
        );

    const createItems = (provider: TodoistQuickAddProvider, searchTerm: string): InstantSearchResultItems =>
        provider.createItems(searchTerm);

    it("returns empty result when prefix does not match", () => {
        const provider = createProvider();
        const result = createItems(provider, "note something");
        expect(result.before).toHaveLength(0);
        expect(result.after).toHaveLength(0);
    });

    it("creates quick add item when prefix matches", () => {
        const provider = createProvider();
        const result = createItems(provider, "todo buy milk");
        expect(result.before).toHaveLength(1);
        expect(result.before[0]?.defaultAction.argument).toBe(JSON.stringify({ text: "buy milk" }));
    });

    it("suggests matching labels", () => {
        const provider = createProvider({ labels: [{ id: "1", name: "Home" }] });
        const result = createItems(provider, "todo plan @ho");
        expect(result.after).toHaveLength(1);
        expect(result.after[0]?.defaultAction.argument).toBe(JSON.stringify({ newSearchTerm: "todo plan @Home " }));
    });

    it("omits project suggestion when whitespace exact match", () => {
        const provider = createProvider({ projects: [{ id: "1", name: "Home chores" }] });
        const result = createItems(provider, "todo task #Home chores");
        expect(result.after).toHaveLength(0);
    });

    it("respects suggestion limit", () => {
        const provider = createProvider({
            labels: [
                { id: "1", name: "Alpha" },
                { id: "2", name: "Beta" },
            ],
            settingsOverrides: { suggestionLimit: 1 },
        });

        const result = createItems(provider, "todo write @");
        expect(result.after).toHaveLength(1);
    });

    it("suggests priorities when fragment matches", () => {
        const provider = createProvider();
        const result = createItems(provider, "todo schedule !p1");
        expect(result.after.map((item) => item.name)).toEqual(["p1"]);
    });
});
