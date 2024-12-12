import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { UrlImageGenerator } from "@Core/ImageGenerator";
import type { SettingsManager } from "@Core/SettingsManager";
import { createEmptyInstantSearchResult, type InstantSearchResultItems, type SearchResultItem } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import type { CustomSearchEngineSetting, Settings } from "@common/Extensions/CustomWebSearch";

export class CustomWebSearchExtension implements Extension {
    public readonly id = "CustomWebSearch";
    public readonly name = "Custom Web Search";

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: "extension[CustomWebSearch]",
    };

    public readonly author = {
        name: "NiewView",
        githubUserName: "NiewView",
    };

    public constructor(
        private readonly assetPathResolver: AssetPathResolver,
        private readonly settingsManager: SettingsManager,
        private readonly urlImageGenerator: UrlImageGenerator,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        // Custom search engines do not have static search results
        return [];
    }

    private createInstantSearchResultItem(engine: CustomSearchEngineSetting, searchTerm: string): SearchResultItem {
        const searchInput = searchTerm.replace(engine.prefix, "").trim();
        const encodeSearchInput = engine.encodeSearchTerm ? encodeURIComponent(searchInput) : searchInput;
        const searchUrl = engine.url.replace("{{query}}", encodeSearchInput);
        return {
            name: engine.name,
            description: `Search in ${engine.name}`,
            id: `${engine.name}:instantResult`,
            image: this.urlImageGenerator.getImage(new URL(searchUrl).origin),
            defaultAction: {
                handlerId: "Url",
                description: `Search in default Browser`,
                argument: searchUrl,
            },
        };
    }

    public getInstantSearchResultItems(searchTerm: string): InstantSearchResultItems {
        const customSearchEngines = this.settingsManager.getValue<CustomSearchEngineSetting[]>(
            getExtensionSettingKey(this.id, "customSearchEngines"),
            this.getSettingDefaultValue("customSearchEngines"),
        );

        const selectedSearchEngines = customSearchEngines.filter((engine) => searchTerm.startsWith(engine.prefix));

        if (selectedSearchEngines.length === 0) {
            return createEmptyInstantSearchResult();
        }

        return {
            after: selectedSearchEngines.map((engine) => this.createInstantSearchResultItem(engine, searchTerm)),
            before: [],
        };
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue(key: keyof Settings) {
        const defaultSettings: Settings = {
            customSearchEngines: [
                {
                    id: crypto.randomUUID(),
                    name: "Wikipedia",
                    prefix: "wiki",
                    url: "https://en.wikipedia.org/wiki/{{query}}",
                    encodeSearchTerm: true,
                },
            ],
        };

        return defaultSettings[key];
    }

    public getImage(): Image {
        const path = this.assetPathResolver.getExtensionAssetPath("CustomWebSearch", "customwebsearch.svg");

        return {
            url: `file://${path}`,
        };
    }

    public getI18nResources() {
        return {
            "en-US": {
                extensionName: "Custom Web Search",
                addSearchEngine: "Add search engine",
                searchEngines: "Search engines",
                url: "URL",
                prefix: "Prefix",
                prefixTooltip: "The prefix to trigger this custom search engine.",
                prefixError: "Prefix is required",
                name: "Name",
                nameError: "Name is required",
                searchEngineUrl: "URL template",
                searchEngineUrlTooltip: "Use `{{query}}` where the search term should be inserted.",
                searchEngineUrlError: "The URL template does not contain `{{query}}` placeholder.",
                encodeSearchTerm: "Encode search term",
                encodeSearchTermTooltip: "Encode the search term before passing it to the search engine.",
                edit: "Edit",
                save: "Save",
                remove: "Remove",
                cancel: "Cancel",
            },
            "de-CH": {
                extensionName: "Benutzerdefinierte Websuche",
                addSearchEngine: "Suchmaschine hinzufügen",
                searchEngines: "Suchmaschinen",
                url: "URL",
                prefix: "Prefix",
                prefixDescription: "Der Präfix, um diese benutzerdefinierte Websuche auszulösen.",
                name: "Name",
                nameDescription: "Der Name der benutzerdefinierten Websuche.",
                searchEngineUrl: "URL-Template",
                searchEngineUrlTooltip: "Verwenden Sie `{{query}}`, wo der Suchbegriff eingefügt werden soll.",
                searchEngineUrlWarning: "Das URL-Template enthält keinen `{{query}}` Platzhalter.",
                encodeSearchTerm: "Suchbegriff URL-kodieren",
                encodeSearchTermTooltip:
                    "Gibt an, ob der Suchbegriff vor der Übergabe an die Suchmaschine kodiert werden soll.",
                edit: "Bearbeiten",
                save: "Speichern",
                remove: "Löschen",
                cancel: "Abbrechen",
            },
        };
    }
}
